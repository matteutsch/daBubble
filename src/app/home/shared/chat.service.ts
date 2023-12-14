import { ElementRef, Injectable } from '@angular/core';
import { Chat, Chats, User } from 'src/app/models/models';
import { SelectService } from './select.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
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
  private privateChats: Chat[] = [];
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
          this.privateChats = chats.map((chat) => chat.payload.doc.data());
          this.privateChatsSubject.next(this.privateChats);
        })
      )
      .subscribe();
    return this.privateChatsSubject.asObservable();
  }

  getPrivateChat(id: any): Observable<any> {
    return this.privateChatsCollection.doc(id).valueChanges();
  }

  createPrivateChat(user: User, currentUser: User) {
    const newChatId = this.afs.createId();
    const newChatData: Chat = {
      id: newChatId,
      name: user.name,
      members: [user, currentUser],
    };
    this.getPrivateCollection().subscribe((chats: Chat[]) => {
      // Überprüfe, ob ein Chat mit den angegebenen Mitgliedern bereits existiert
      const existingChat = chats.find(
        (chat) =>
          chat.members.some((member) => member.id === user.id) &&
          chat.members.some((member) => member.id === currentUser.id)
      );
    });
    //TODO: condition for exisiting members
    this.afs
      .collection('privateChats')
      .doc(newChatId)
      .set(newChatData)
      .then(() => {
        console.log('Document written with ID: ', newChatId);
        /*       this.userService.updatePrivateChat(user.uid, newChatData);
        this.userService.updatePrivateChat(currentUser.uid, newChatData); */
      })
      .catch((error) => {
        console.error('Error creating document: ', error);
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
