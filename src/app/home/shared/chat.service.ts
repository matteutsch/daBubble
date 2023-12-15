import { ElementRef, Injectable } from '@angular/core';
import { Chat, User } from 'src/app/models/models';
import { SelectService } from './select.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, lastValueFrom, map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private customTextAreaRef: any;
  isMainChatChannel: boolean = false;
  isNewChat: boolean = true;
  isMyPrivatChat: boolean = false;

  privateChatsCollection: AngularFirestoreCollection<any>;
  private allPrivateChats: Chat[] = [];
  public privateChatsSubject = new BehaviorSubject<Chat[]>([]);

  channelChatsCollection: AngularFirestoreCollection<any>;
  private channelChats: Chat[] = [];
  public channelChatsSubject = new BehaviorSubject<Chat[]>([]);

  constructor(
    public select: SelectService,
    private afs: AngularFirestore,
    private userService: UserService
  ) {
    this.privateChatsCollection = this.afs.collection('privateChats');
    this.channelChatsCollection = this.afs.collection('channelChats');
    this.getPrivateCollection();
  }

  getPrivateCollection() {
    this.privateChatsCollection
      .snapshotChanges()
      .pipe(
        map((chats) => {
          this.allPrivateChats = chats.map((chat) => chat.payload.doc.data());
          this.privateChatsSubject.next(this.allPrivateChats);
        })
      )
      .subscribe();
    return this.privateChatsSubject.asObservable();
  }

  getPrivateChat(id: any): Observable<any> {
    return this.privateChatsCollection.doc(id).valueChanges();
  }

  async createPrivateChat(user: User, currentUser: User) {
    const newChatId = this.afs.createId();
    const newChatData: Chat = {
      id: newChatId,
      name: user.name,
      members: [user.uid, currentUser.uid],
    };
    const [selectedUserPrivateChats, loggedUserPrivateChats] =
      await Promise.all([
        this.fetchPrivateChats(user.uid),
        this.fetchPrivateChats(currentUser.uid),
      ]);

    if (!this.haveCommonID(selectedUserPrivateChats, loggedUserPrivateChats)) {
      console.log('set private chat');
      this.afs
        .collection('privateChats')
        .doc(newChatId)
        .set(newChatData)
        .then(() => {
          this.setprivateChatToUser(user.uid, newChatId);
          this.setprivateChatToUser(currentUser.uid, newChatId);
        })
        .catch((error) => {
          console.error('Error creating document: ', error);
        });
    } else {
      this.openPrivateChat(user, currentUser);
    }
  }

  async fetchPrivateChats(userID: string) {
    let user = await this.userService.fetchUserData(userID);
    let privateChats;
    await user.forEach((data: any) => {
      privateChats = data.data().chats.private;
    });
    return privateChats;
  }

  haveCommonID(array1: any, array2: any) {
    for (let i = 0; i < array1.length; i++) {
      if (array2.includes(array1[i])) {
        return true;
      }
    }
    return false;
  }

  async setprivateChatToUser(id: string, chatID: string) {
    let user = await this.userService.fetchUserData(id);
    user.subscribe(() => {
      this.userService.updatePrivateChat(id, chatID);
    });
  }

  setTextareaRef(ref: ElementRef) {
    this.customTextAreaRef = ref;
  }
  getTextareaRef(): any {
    return this.customTextAreaRef;
  }

  openPrivateChat(selectedUser: User, currentUser: User) {
    this.select.setSelectedUser(selectedUser);
    if (selectedUser === currentUser) {
      this.openMyPrivatChat();
    } else {
      this.openDirectChat();
    }
  }

  openChannelChat() {
    this.isMainChatChannel = true;
  }

  openNewChat() {
    this.isMainChatChannel = false;
    this.isNewChat = true;
    this.isMyPrivatChat = false;
  }

  openDirectChat() {
    this.isMainChatChannel = false;
    this.isNewChat = false;
    this.isMyPrivatChat = false;
  }

  openMyPrivatChat() {
    this.isMainChatChannel = false;
    this.isNewChat = false;
    this.isMyPrivatChat = true;
  }
}
