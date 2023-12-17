import { ElementRef, Injectable } from '@angular/core';
import { Chat, MessageData, User } from 'src/app/models/models';
import { SelectService } from './select.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

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

  public currentChat!: Chat;

  constructor(
    public select: SelectService,
    private afs: AngularFirestore,
    private userService: UserService
  ) {
    this.privateChatsCollection = this.afs.collection('privateChats');
    this.channelChatsCollection = this.afs.collection('channelChats');
    //this.getPrivateCollection();
  }

  setTextareaRef(ref: ElementRef) {
    this.customTextAreaRef = ref;
  }

  getTextareaRef(): any {
    return this.customTextAreaRef;
  }

  openChannelChat() {
    this.isMainChatChannel = true;
  }

  openNewChat() {
    this.isMainChatChannel = false;
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

  /**
   * Checks if array2 includes elements of array1.
   * @param {any} array1 - The array containing elements to be searched for.
   * @param {any} array2 - The array to be searched in.
   * @returns {Boolean} True if any element from array1 is found in array2, otherwise false
   */
  haveCommonID(array1: any, array2: any): Boolean {
    for (let i = 0; i < array1.length; i++) {
      if (array2.includes(array1[i])) {
        return true;
      }
    }
    return false;
  }

  /*-------------------- START  private-chat functions  --------------------*/

  /**
   * Checks if a member with the given ID is not already in the privateChatMembers array.
   * @param memberID - ID of the member to check.
   * @param chat - An array representing the private chat members.
   * @returns True if the member with the specified ID is not in the private chat; otherwise, false.
   */
  isNotMember(memberID: string, members: User[]): boolean {
    return !members.some((member: User) => member.uid === memberID);
  }

  /**
   * Returns all existing private chats as observable.
   * @returns {Observable<any>} An Observable that emits the private chat data.
   */
  /*   getPrivateCollection(): Observable<Object> {
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
  } */

  /**
   * Returns a single private chat as observable.
   * @param {string} id - id of the private chat.
   * @returns {Observable<any>} An Observable that emits the private chat data.
   */
  getPrivateChat(id: any): Observable<any> {
    return this.privateChatsCollection.doc(id).valueChanges();
  }

  /**
   * Returns a new Chat object for createPrivateChat().
   * @param {string} chatId - id of the private chat.
   * @param {User} user - the User u want to a create a private chat with.
   */
  createNewChatData(chatId: string, user: User, currentUser: User) {
    const newChatData: Chat = {
      id: chatId,
      name: user.name,
      members: [user.uid, currentUser.uid],
      messages: [],
    };
    return newChatData;
  }

  /**
   * Creates a new privateChat between currentUser and a selected user.
   * @param {User} user - selected user.
   * @param {User} currentUser - logged in User
   * @returns {Promise<void>} A Promise that resolves once the private chat is created and updated for both users.
   */
  async createPrivateChat(user: User, currentUser: User): Promise<void> {
    const newChatId = this.afs.createId();
    const newChatData = this.createNewChatData(newChatId, user, currentUser);
    const privateChatMember = { ...user, privateChatId: newChatId };

    const [selectedUserPrivateChats, loggedUserPrivateChats] =
      await Promise.all([
        this.fetchPrivateChats(user.uid),
        this.fetchPrivateChats(currentUser.uid),
      ]);
    if (!this.haveCommonID(selectedUserPrivateChats, loggedUserPrivateChats)) {
      this.afs
        .collection('privateChats')
        .doc(newChatId)
        .set(newChatData)
        .then(() => {
          this.setPrivateChatToUser(user.uid, privateChatMember);
          this.setPrivateChatToUser(currentUser.uid, privateChatMember);
        })
        .catch((error) => {
          console.error('Error creating document: ', error);
        });
    } else {
      // this.openPrivateChat(user, currentUser);
    }
  }

  /**
   * Fetches the private chat data for a specified user.
   * @param {string} userID - The unique identifier of the user for whom private chat data is fetched.
   * @returns {Promise<any>} A Promise that resolves to an array of private chat IDs associated with the user.
   */
  async fetchPrivateChats(userID: string): Promise<any> {
    let user = await this.userService.fetchUserData(userID);
    let privateChats;
    await user.forEach((data: any) => {
      privateChats = data.data().chats.private;
    });
    return privateChats;
  }

  /**
   * Associates a private chat ID with a user by updating the user's data.
   * @param {string} id - The id of the user.
   * @param {string} chatID - The ID of the private chat to associate with the user.
   * @returns {Promise<void>} A Promise that resolves once the user's data is updated.
   */
  async setPrivateChatToUser(id: string, chatMember: User): Promise<void> {
    let user = await this.userService.fetchUserData(id);
    user.subscribe(() => {
      this.userService.updatePrivateChat(id, chatMember);
    });
  }
  /*-------------------- END  private-chat functions  --------------------*/

  /*-------------------- START  channel-chat functions  --------------------*/
  /*   async setChannelChatToUser(id: string, chatID: string): Promise<void> {
    let user = await this.userService.fetchUserData(id);
    user.subscribe(() => {
      this.userService.updatePrivateChat(id, chatID);
    });
  } */
  /*
  getUsersChannelChats(userID: string): Observable<any> {
    return this.userService
      .getUser(userID)
      .pipe(map((user) => user.chats.channel));
  }

  getChannelCollection() {
    this.channelChatsCollection
      .snapshotChanges()
      .pipe(
        map((chats) => {
          this.channelChats = chats.map((chat) => chat.payload.doc.data());
          this.channelChatsSubject.next(this.channelChats);
          console.log(this.channelChats);
        })
      )
      .subscribe();
    return this.channelChatsSubject.asObservable();
  } */
  /*-------------------- END  channel-chat functions  --------------------*/

  // TODO: Render chat from selectedUser.chatID and edit message, delete message
  async sendMessage(author: string, contentText: string) {
    const message = new MessageData(
      author,
      contentText,
      new Date().getTime()
    ).toFirestoreObject();
    const ref = this.privateChatsCollection.doc(this.currentChat.id);
    const messagesArr = this.currentChat.messages;
    messagesArr?.push(message);
    console.log('message', message);

    await ref.update({
      messages: messagesArr,
    });
  }

  setCurrentChat(chatID: string, selectedUser: User) {
    this.select.setSelectedMember(selectedUser);
    this.getPrivateChat(chatID).subscribe((chat) => {
      this.currentChat = chat;
    });
  }
}
