import { ElementRef, Injectable } from '@angular/core';
import { Chat, MessageData, User } from 'src/app/models/models';
import { SelectService } from './select.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  lastValueFrom,
  map,
  take,
} from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  //use in ngOnDestroy and use as trigger to end subscriptions with .takeUntil(this.unsubscribe$),
  //private unsubscribe$ = new Subject<void>();
  private customTextAreaRef: any;
  user!: User;

  public userChannelChatsSubject = new BehaviorSubject<Chat[]>([]);
  userChannelChats: any[] = [];
  userChannelChats$ = this.userChannelChatsSubject.asObservable();

  public channelMemberSubject = new BehaviorSubject<User[]>([]);
  channelMembers: User[] = [];
  channelMember$ = this.channelMemberSubject.asObservable();

  privateChatsCollection: AngularFirestoreCollection<any>;
  public privateChatsSubject = new BehaviorSubject<Chat[]>([]);

  channelChatsCollection: AngularFirestoreCollection<any>;
  private channelChats: Chat[] = [];
  public channelChatsSubject = new BehaviorSubject<Chat[]>([]);

  public currentChat!: Chat | null;
  public currentChannel!: Chat | null;

  constructor(
    public select: SelectService,
    private afs: AngularFirestore,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.privateChatsCollection = this.afs.collection('privateChats');
    this.channelChatsCollection = this.afs.collection('channelChats');
    this.getChannelCollection();

    //TODO: change the way we get the currentUser ?
    authService.user.subscribe((user) => {
      if (user) {
        this.userService.getUser(user.uid).subscribe((currentUser) => {
          this.user = currentUser;
          this.updateAndPushChannelChats();
        });
      }
    });
  }

  setTextareaRef(ref: ElementRef) {
    this.customTextAreaRef = ref;
  }

  getTextareaRef(): any {
    return this.customTextAreaRef;
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
  createNewChatData(user: User, currentUser: User) {
    const newChatId = this.afs.createId();
    const newChatData: Chat = {
      id: newChatId,
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
    const newChatData = this.createNewChatData(user, currentUser);
    const privateChatMember = { ...user, privateChatId: newChatData.id };
    const thisChatMember = { ...currentUser, privateChatId: newChatData.id };

    const [selectedUserPrivateChats, loggedUserPrivateChats] =
      await Promise.all([
        this.fetchPrivateChats(user.uid),
        this.fetchPrivateChats(currentUser.uid),
      ]);
    if (!this.haveCommonID(selectedUserPrivateChats, loggedUserPrivateChats)) {
      this.privateChatsCollection
        .doc(newChatData.id)
        .set(newChatData)
        .then(() => {
          this.setPrivateChatToUser(user.uid, thisChatMember);
          this.setPrivateChatToUser(currentUser.uid, privateChatMember);
        })
        .catch((error) => {
          console.error('Error creating document: ', error);
        });
    } else {
      //open private chat
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
   * @param {User} chatMember - the ChatMember to push.
   * @returns {Promise<void>} A Promise that resolves once the user's data is updated.
   */
  async setPrivateChatToUser(id: string, chatMember: User): Promise<void> {
    let user = await this.userService.fetchUserData(id);
    user.subscribe(() => {
      this.userService.addNewPrivateChat(id, chatMember);
    });
  }
  /*-------------------- END  private-chat functions  --------------------*/

  /*-------------------- START  channel-chat functions  --------------------*/

  nameExists(name: string): boolean {
    return this.channelChats.some((channel) => channel.name === name);
  }

  createChannel(name: string, description: string, user: User) {
    const newChatId = this.afs.createId();
    const newChannel: Chat = {
      id: newChatId,
      name: name,
      members: [user.uid],
      messages: [],
      description: description,
      createdBy: user.name,
    };
    return newChannel;
  }

  updateChannelCollection(name: string, description: string, user: User) {
    const newChannel = this.createChannel(name, description, user);

    if (!this.nameExists(newChannel.name)) {
      this.channelChatsCollection
        .doc(newChannel.id)
        .set(newChannel)
        .then(() => {
          this.userService.addNewChannel(user.uid, newChannel.id);
        })
        .catch((error) => {
          console.error('Error', error);
        });
    }
  }

  getChannelCollection() {
    this.channelChatsCollection
      .snapshotChanges()
      .pipe(
        map((chats) => {
          this.channelChats = chats.map((chat) => chat.payload.doc.data());
          this.channelChatsSubject.next(this.channelChats);
        })
      )
      .subscribe();
    return this.channelChatsSubject.asObservable();
  }

  //channel chat & direct chat being shown depending on currentChat/currentChannel
  //- check mainChatComponent.html
  setCurrentChat(chatID: string, selectedUser: User) {
    this.select.setSelectedMember(selectedUser);
    this.getPrivateChat(chatID).subscribe((chat) => {
      this.currentChannel = null;
      this.currentChat = chat;
    });
  }
  setCurrentChannel(channelId: string, selectedChannel: User) {
    this.select.setSelectedChannel(selectedChannel);
    this.getChannelById(channelId).subscribe((channel) => {
      this.currentChat = null;
      this.currentChannel = channel;
    });
  }
  getChannelById(id: any): Observable<any> {
    return this.channelChatsCollection.doc(id).valueChanges();
  }
  getSingleChannel(id: any) {
    return this.channelChatsCollection.doc(id);
  }

  updateChannel(id: string, data: any) {
    this.channelChatsCollection
      .doc(id)
      .update({
        name: data.nameControl,
        description: data.descriptionControl,
      })
      .then(() => {
        this.updateAndPushChannelChats();
      });
  }

  updateChannelMember(id: string, memberId: string) {
    const channelRef = this.channelChatsCollection.doc(id);
    channelRef.get().subscribe((channelDoc) => {
      if (channelDoc.exists) {
        const channelData = channelDoc.data() as any;
        if (!channelData.members.includes(memberId)) {
          channelData.members.push(memberId);
          channelRef
            .update({
              members: channelData.members,
            })
            .then(() => {
              this.userService.addNewChannel(memberId, id);
              this.select.selectedChannelSubject.next({
                ...channelData,
                members: channelData.members,
              });
              this.updateAndPushChannelChats();
            });
        }
      }
    });
  }

  updateAndPushChannelChats() {
    if (this.user.chats && this.user.chats.channel) {
      this.user.chats.channel.forEach((id: any) => {
        const existingChannel = this.getChannelById(id);
        existingChannel.pipe(take(1)).subscribe((singleChannel) => {
          const isExisting = this.userChannelChatsSubject.value.some(
            (existingChannel) => existingChannel.id === singleChannel.id
          );

          const updatedChannels = isExisting
            ? this.userChannelChatsSubject.value.map((existingChannel) =>
                existingChannel.id === singleChannel.id
                  ? singleChannel
                  : existingChannel
              )
            : [...this.userChannelChatsSubject.value, singleChannel];

          this.userChannelChatsSubject.next(updatedChannels);
        });
      });
    }
  }

  //TODO: add function, that updates the sidebar properly
  async deleteUserFromChannel(userID: string, channelID: string) {
    const channelRef = this.getSingleChannel(channelID);
    let channelDoc = channelRef.get();

    channelDoc.subscribe(async (c) => {
      let channelData = c.data();
      let array = c.data().members;
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element === userID) {
          array.splice(i, 1);
          if (array.length <= 0) {
            channelRef.delete();
          } else {
            await channelRef.update({
              members: array,
            });
            this.channelMemberSubject.next(array);
            this.select.selectedChannelSubject.next({
              ...channelData,
              members: array,
            });
          }
          await this.deleteChannelFromUser(userID, channelID);
        }
      }
    });
  }

  async deleteChannelFromUser(userID: string, channelID: string) {
    let userRef = this.userService.usersCollection.doc(userID);
    let userDoc = userRef.get();
    userDoc.subscribe(async (e) => {
      let array = e.data().chats.channel;
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element === channelID) {
          array.splice(i, 1);
          await userRef
            .update({
              'chats.channel': array,
            })
            .then(() => {
              array.forEach((e: any) => {
                let channel = this.getSingleChannel(e);
                channel.get().subscribe((c) => {
                  this.userChannelChats.push(c.data());
                });
                this.userChannelChatsSubject.next(this.userChannelChats);
              });
            });
        }
      }
    });
  }

  /*-------------------- END  channel-chat functions  --------------------*/

  /*-------------------- START  SendMessage functions  --------------------*/

  // TODO: Render chat from selectedUser.chatID and edit message, delete message
  async sendMessage(author: string, contentText: string) {
    const message = new MessageData(
      author,
      contentText,
      new Date().getTime()
    ).toFirestoreObject();
    const ref = this.privateChatsCollection.doc(this.currentChat!.id);
    const messagesArr = this.currentChat!.messages;
    messagesArr?.push(message);
    console.log('message', message);

    await ref.update({
      messages: messagesArr,
    });
  }

  /*-------------------- END  SendMessage functions  --------------------*/
}
