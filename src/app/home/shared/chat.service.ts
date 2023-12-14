import { ElementRef, Injectable, OnChanges } from '@angular/core';
import { Chat, Chats, User } from 'src/app/models/models';
import { SelectService } from './select.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnChanges {
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

  constructor(public select: SelectService, private afs: AngularFirestore) {
    this.privateChatsCollection = this.afs.collection('privateChats');
    this.channelChatsCollection = this.afs.collection('channelChats');

    this.getPrivateCollection();
    console.log('privateChats:', this.privateChats);
  }

  ngOnChanges() {
    this.getPrivateCollection().subscribe((chats) => {
      this.privateChats = chats;
      console.log('update privateChats:', this.privateChats);
      
    });
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

  setTextareaRef(ref: ElementRef) {
    this.customTextAreaRef = ref;
  }
  getTextareaRef(): any {
    return this.customTextAreaRef;
  }

  setPrivateChat(selectedUser: User, currentUser: User) {
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
