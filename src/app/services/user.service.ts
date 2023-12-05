import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, addDoc, onSnapshot, doc, updateDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import { userData } from '../models/userData';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  user: User | null = null;
  userObject: userData = new userData();
  docId: string = '';
  selectedUserName: string = 'Gast';
  selectedUserPhotoURL: string = 'assets/characters/default_character.png';
  selectedUserEmail: string = 'gast@babble.de';
  selectedUserUid: string = '';
  messageText: string = '';
  foundPrivateMessages: DocumentData[] = [];
  usersList: any;
  selectedChatPartner: any;
  currentChat: any;
  availableChatPartners: DocumentData[] = [];
  currentChatId: string = '';
  chatAlreadyExists: boolean = false;
  myDocId: string = '';
  myUserDocument: any;


  constructor() {
    this.getUserData();
    this.subPrivateChat();

    this.getUserList();
    this.userObject.name = this.getName();
    this.userObject.email = this.getMail();
    this.userObject.photoURL = this.getPhoto();
    this.userObject.uid = this.getId();
    this.userObject.chat = [];
  }

/**
 * The function returns the display name of a user if available, otherwise it returns 'Gast'.
 * @returns the display name of the user if it exists, otherwise it returns the string 'Gast'.
 */
  getName() {
    return this.user ? this.user.displayName || 'Gast' : 'Gast';
  }

/**
 * The function returns the photo URL of a user if available, otherwise it returns the default photo
 * URL.
 * @returns the photo URL of the user if it exists, otherwise it is returning the default character
 * image URL.
 */
  getPhoto() {
    return this.user
      ? this.user.photoURL || 'assets/characters/default_character.png'
      : 'assets/characters/default_character.png';
  }

/**
 * The getMail function returns the email of the user if available, otherwise it returns a default
 * email address.
 * @returns the email address of the user if it exists, otherwise it returns the default email address
 * 'gast@mail.de'.
 */
  getMail() {
    return this.user ? this.user.email || 'gast@mail.de' : 'gast@mail.de';
  }

/**
 * The function `getId` returns the user's unique identifier if it exists, otherwise it returns an
 * empty string.
 * @returns the user's uid if it exists, otherwise it returns an empty string.
 */
  getId() {
    return this.user ? this.user.uid || '' : '';
  }

/**
 * The function `getUserData` updates the `user` property based on the authentication state.
 */
  getUserData() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }

  privateMessage() {
    return {
      userName: this.user ? this.user.displayName : 'Gast',
      profileImg: this.user
        ? this.user.photoURL
        : 'assets/characters/default_character.png',
      imageUrl: '',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      text: this.messageText,
      email: this.user ? this.user.email : 'gast@babble.de',
      reactions: [],
    };
  }

  sendPrivateChatMessage() {
    this.currentChat.push(this.privateMessage());
  }

  getPrivateChannels() {
    return collection(this.firestore, 'private-channels');
  }

  subPrivateChat() {
    return onSnapshot(this.getPrivateChannels(), (channel) => {
      this.availableChatPartners = [];
      channel.forEach((chat) => {
        const privateChat = chat.data();

        if (this.user) {
          if (privateChat['participants'].includes(this.user.uid)) {
            this.foundPrivateMessages.push(privateChat);

            privateChat['participantsInfos'].forEach((user: any) => {
              if (user.uid != this.user?.uid) {
                if (!this.availableChatPartners.includes(user)) {
                  this.availableChatPartners.push(user);
                }
              }
            });
          }
        }
      });
    });
  }

  doesChatExist() {
    this.foundPrivateMessages.forEach((chat) => {
      if (
        chat['participants'].includes(this.user?.uid) &&
        chat['participants'].includes(this.selectedChatPartner.uid)
      ) {
        this.currentChat = chat;
        this.chatAlreadyExists = true;
      }
    });
  }

  createChat() {
    if (!this.chatAlreadyExists) {
      this.currentChat = {};
      this.createChatinDB();
    }
  }

  createPrivateChat() {
    return {
      participants: [this.user?.uid, this.selectedChatPartner.uid],
      participantsInfos: [
        {
          name: this.user?.displayName,
          profileImg: this.user?.photoURL,
          uid: this.user?.uid,
          email: this.user?.email,
        },
        this.selectedChatPartner,
      ],
      chat: [],
    };
  }

  subToChosenChat(): Observable<any> {
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(this.getPrivateChannels(), (chats) => {
        const currentChat = {};
        chats.forEach((chat) => {
          const chatData = chat.data();
          if (
            chatData['participants'] &&
            this.user &&
            chatData['participants'].includes(this.user.uid) &&
            chatData['participants'].includes(this.selectedChatPartner?.uid)
          ) {
            this.currentChatId = chat.id;
            this.currentChat = chatData;
          }
        });
        observer.next(this.currentChat);
      });

      return () => unsubscribe();
    });
  }

  async createChatinDB() {
    await addDoc(this.getPrivateChannels(), this.createPrivateChat());
  }

/**
 * The function `getUserList` retrieves a list of users and updates the `usersList` property, while
 * also finding the current user's document and storing it in `myUserDocument`.
 * @returns The `onSnapshot` function is being returned.
 */
  getUserList() {
    return onSnapshot(this.getUsers(), (userList) => {
      this.usersList = [];
      userList.forEach((user) => {
        const found_user = user.data();
        if (found_user['uid'] === this.user?.uid) {
          this.myDocId = user.id;
          this.myUserDocument = found_user;
        }
      });
    });
  }

/* The `updateName()` function is an asynchronous function that updates the user's name in the
Firestore database. */
  async updateName() {
    let docRef = this.getSingleDocRef();
    await updateDoc(docRef, this.myUserDocument);
  }

  getUsers() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef() {
    return doc(collection(this.firestore, 'users'), this.myDocId);
  }

}
