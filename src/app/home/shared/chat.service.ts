import { ElementRef, Injectable } from '@angular/core';
import { Chat, Chats, User } from 'src/app/models/models';
import { SelectService } from './select.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';
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

  /*   createPrivateChat(user: User, currentUser: User) {
    const newChatId = this.afs.createId();
    const newChatData: Chat = {
      id: newChatId,
      name: user.name,
      members: [user.uid, currentUser.uid],
    };
/*     this.getPrivateCollection().subscribe((chats) => {
      console.log('chats:', chats);
      
      // Überprüfe, ob ein Chat mit den angegebenen Mitgliedern bereits existiert
      // const existingChat = chats.find(
      //   (chat) =>
      //     chat.members.some((member) => member.id === user.id) &&
      //     chat.members.some((member) => member.id === currentUser.id)
      // );
    }); */
    // TODO: condition for exisiting members
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
  }

  async setprivateChatToUser(id: string, chatID: string) {
    let user = await this.userService.fetchUserData(id);
    user.subscribe((data: any) => {
      this.userService.updatePrivateChat(id, chatID);
    });
  } */
  createPrivateChat(user: User, currentUser: User) {
    let exists: boolean = this.checkIfChatExists(user.uid, currentUser.uid);
    if (!exists) {
      // Wenn kein Chat existiert, neuen Chat hinzufügen
      const newChatId = this.afs.createId();
      const newChatData: Chat = {
        id: newChatId,
        name: user.name,
        members: [user.uid, currentUser.uid],
      };

      this.afs
        .collection('privateChats')
        .doc(newChatId)
        .set(newChatData)
        .then(() => {
          console.log('Document written with ID: ', newChatId);
        })
        .catch((error) => {
          console.error('Error creating document: ', error);
        });
    } else {
      // Falls ein Chat bereits existiert, hier könntest du eine Benachrichtigung auslösen oder nichts tun
      console.log('Chat already exists');
    }
  }

  checkIfChatExists(userId: string, currentUserId: string) {
    this.userService.getUser(currentUserId).subscribe((currentUser) => {
      const privateChats = currentUser.private || [];
      let exists: boolean;
      if (privateChats.includes(userId)) {
        exists = true;
        console.log(`${userId} is already in private chats`);
      } else {
        exists = false;
        console.log(`${userId} is not in private chats`);
      }
      return exists;
    });
  }
  /*  return this.afs
    .collection('privateChats', (ref) =>
      ref.where('members', 'array-contains-any', [userId])
    )
    .get(); */

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
