import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import {
  ChannelChat,
  ChannelChatData,
  Chat,
  ChatData,
  User,
} from 'src/app/models/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelChatService {
  public channels: Chat[] = [];
  private channelsSubject = new BehaviorSubject<Chat[]>([]);
  public uChannelChats: Chat[] = [];
  public channelChatsSubscription!: Subscription;

  constructor(
    private afs: AngularFirestore,
    private firestoreService: FirestoreService
  ) {}

  /**
   * Handles channel chats for the specified user by processing each channel chat and pushing them into the specified collection.
   *
   * @param {User} user - The user for whom channel chats are handled.
   * @param {AngularFirestoreCollection} collection - The Firestore collection containing channel chat data.
   * @public
   */
  public handleChannelChats(
    user: User,
    collection: AngularFirestoreCollection
  ): void {
    this.uChannelChats = [] as Chat[];
    user.chats.channel.forEach((chat: ChannelChat) => {
      this.pushChatInChannel(chat.chatID, collection);
    });
  }

  /**
   * Retrieves all channels from the specified Firestore collection and returns them as an observable.
   *
   * @param {AngularFirestoreCollection} collection - The Firestore collection containing channel data.
   * @returns {Observable<Chat[]>} - An observable containing an array of channels.
   */
  public getAllChannels(
    collection: AngularFirestoreCollection
  ): Observable<Chat[]> {
    collection
      .snapshotChanges()
      .pipe(
        map((channels) => {
          this.channels = channels.map((channel) => {
            const data = channel.payload.doc.data() as Chat;
            return data;
          });
          this.channelsSubject.next(this.channels);
        })
      )
      .subscribe();
    return this.channelsSubject.asObservable();
  }

  /**
   * Subscribes to updates in a Firestore document for a channel chat and processes the update.
   *
   * @param {string} chatID - The ID of the channel chat to monitor.
   * @param {AngularFirestoreCollection} collection - The Firestore collection containing channel chat data.
   * @returns {void}
   */
  public pushChatInChannel(
    chatID: string,
    collection: AngularFirestoreCollection
  ): void {
    if (chatID) {
      let isSubscribe = false;
      const channelDoc$ = collection
        .doc(chatID)
        .valueChanges() as Observable<any>;
      this.channelChatsSubscription = channelDoc$.subscribe((chat: Chat) => {
        if (chat && this.shouldSubscribe(isSubscribe)) {
          isSubscribe = true;
          this.processChannelChatUpdate(chat);
        }
      });
    }
  }

  /**
   * Processes the update received for a channel chat and updates the list of channel chats.
   *
   * @param {Chat} chat - The channel chat data to process.
   * @returns {void}
   * @private
   */
  private processChannelChatUpdate(chat: Chat): void {
    const isChannel = this.isChannelExisting(chat.chatID);
    if (!isChannel) {
      this.uChannelChats.push(chat);
    } else {
      this.updateChannelChats(chat);
    }
  }

  /**
   * Updates the list of channel chats with the provided updated channel chat.
   *
   * @param {Chat} updatedChat - The updated channel chat.
   * @returns {void}
   * @private
   */
  private updateChannelChats(updatedChat: Chat): void {
    this.uChannelChats.forEach((chat: Chat, index) => {
      if (chat.chatID === updatedChat.chatID) {
        this.uChannelChats[index] = updatedChat;
      }
    });
  }

  /**
   * Checks if a channel chat with the specified ID already exists in the list of channel chats.
   *
   * @param {string} newChatID - The ID of the new channel chat.
   * @returns {boolean} - A boolean indicating whether the channel chat already exists.
   * @private
   */
  private isChannelExisting(newChatID: string): boolean {
    return this.uChannelChats.some((channel) => channel.chatID === newChatID);
  }

  /**
   * Sets a Firestore document for the provided channel chat, updating the user's channel list.
   *
   * @param {Chat} chat - The channel chat to set as a document.
   * @param {User} currentUser - The current user.
   * @param {AngularFirestoreCollection} collection - The Firestore collection to set the document in.
   * @returns {Promise<void>}
   */
  public async setChannelDoc(
    chat: Chat,
    currentUser: User,
    collection: AngularFirestoreCollection
  ): Promise<void> {
    collection
      .doc(chat.chatID)
      .set(chat)
      .then(() => {
        this.updateUserChannel(chat.chatID, currentUser);
      })
      .catch((error: any) => {
        throw Error('The app component has thrown an error!', error);
      });
  }

  /**
   * Creates a new channel chat with the specified name, description, and current user.
   *
   * @param {string} chatName - The name of the new channel chat.
   * @param {string} description - The description of the new channel chat.
   * @param {User} currentUser - The current user.
   * @returns {Chat} - The newly created channel chat.
   */
  public createChannelForCollection(
    chatName: string,
    description: string,
    currentUser: User
  ): Chat {
    const newChatId = this.afs.createId();
    const newChatData = new ChatData(
      newChatId,
      currentUser,
      chatName,
      description
    );
    newChatData.setType('channel');
    return newChatData.toFirestoreObject();
  }

  /**
   * Updates the user's channel list with the new channel chat ID.
   *
   * @param {string} chatID - The ID of the new channel chat.
   * @param {User} currentUser - The current user.
   * @returns {void}
   */
  public updateUserChannel(chatID: string, currentUser: User): void {
    const newChannel = new ChannelChatData(chatID);
    const channelChats = currentUser.chats.channel;
    channelChats.push(newChannel.toFirestoreObject());
    this.afs
      .collection('users')
      .doc(currentUser.uid)
      .update({
        'chats.channel': channelChats,
      } as Partial<User>);
  }

  /**
   * Updates the channel information with the provided data in the specified Firestore collection.
   *
   * @param {string} chatID - The ID of the channel chat to update.
   * @param {any} data - The data to update the channel with.
   * @param {AngularFirestoreCollection} collection - The Firestore collection containing channel chat data.
   * @returns {void}
   */
  public updateChannel(
    chatID: string,
    data: any,
    collection: AngularFirestoreCollection
  ): void {
    collection.doc(chatID).update({
      name: data.nameControl,
      description: data.descriptionControl,
    });
  }

  /**
   * Adds a new member to the channel chat and updates the Firestore document.
   *
   * @param {string} memberID - The ID of the new member to add.
   * @param {string} chatID - The ID of the channel chat.
   * @param {AngularFirestoreCollection} collection - The Firestore collection containing channel chat data.
   * @param {Chat} chat - The channel chat to update.
   * @returns {Promise<void>}
   */
  public async updateChannelMembers(
    memberID: string,
    chatID: string,
    collection: AngularFirestoreCollection,
    chat: Chat
  ): Promise<void> {
    const members: string[] = chat.members;
    members.push(memberID);
    collection.doc(chatID).update({
      members: members,
    });
  }

  /**
   * Retrieves the updated channel list after adding a new channel chat and returns it as a promise.
   *
   * @param {string} memberID - The ID of the new member.
   * @param {string} chatID - The ID of the new channel chat.
   * @returns {Promise<ChannelChat[]>} - A promise containing the updated channel list.
   */
  public async getUpdatedChannel(
    memberID: string,
    chatID: string
  ): Promise<ChannelChat[]> {
    const channel: ChannelChat[] =
      await this.firestoreService.getPropertyFromDocument(
        'users',
        memberID,
        'chats.channel'
      );
    channel.push(new ChannelChatData(chatID).toFirestoreObject());
    return channel;
  }

  /**
   * Updates the user's channel list with the provided channel array.
   *
   * @param {string} memberID - The ID of the member.
   * @param {ChannelChat[]} channel - The updated channel array.
   * @returns {Promise<void>}
   */
  public async updateMemberChannel(
    memberID: string,
    channel: ChannelChat[]
  ): Promise<void> {
    await this.afs
      .collection('users')
      .doc(memberID)
      .update({
        'chats.channel': channel,
      } as Partial<User>);
  }

  /**
   * Deletes a channel chat from the user's channel list.
   *
   * @param {User} user - The user from whom to delete the channel chat.
   * @param {string} chatID - The ID of the channel chat to delete.
   * @returns {Promise<void>}
   */
  public async deleteChannelChatFromUser(
    user: User,
    chatID: string
  ): Promise<void> {
    try {
      const channelChats = await this.firestoreService.getPropertyFromDocument(
        'users',
        user.uid,
        'chats.channel'
      );
      channelChats.forEach((channelChat: ChannelChat, index: number) => {
        if (channelChat.chatID === chatID) {
          channelChats.splice(index, 1);
        }
      });
      await this.afs
        .collection('users')
        .doc(user.uid)
        .update({
          'chats.channel': channelChats,
        } as Partial<User>);
    } catch (error) {
      console.error(`Error deleting channel chat from user: ${error}`);
      throw new Error('Failed to delete channel chat from user.');
    }
  }

  /**
   * Checks if a channel chat with the specified ID already exists in the user's channel list.
   *
   * @param {string} newChatID - The ID of the new channel chat.
   * @param {User} user - The user to check for existing channel chats.
   * @returns {boolean} - A boolean indicating whether the channel chat already exists for the user.
   */
  public isChannelChatAlreadyExists(newChatID: string, user: User): boolean {
    let existingChannelChats: ChannelChat[] = user.chats.channel;
    const isNewChatAlreadyInArray = existingChannelChats.some(
      (chat: ChannelChat) => chat.chatID === newChatID
    );
    return isNewChatAlreadyInArray;
  }

  /**
   * Checks if it is appropriate to subscribe to the channel chats.
   *
   * @param {boolean} isSubscribe - Indicates whether the subscription is already in progress.
   * @returns {boolean} - A boolean indicating whether it is appropriate to subscribe.
   * @private
   */
  private shouldSubscribe(isSubscribe: boolean): boolean {
    return (
      this.channelChatsSubscription &&
      !this.channelChatsSubscription.closed &&
      !isSubscribe
    );
  }

  /**
   * Unsubscribes from the channel chat subscription if it is active.
   *
   * @returns {void}
   */
  public unsubscribeChannelChats(): void {
    if (
      this.channelChatsSubscription &&
      !this.channelChatsSubscription.closed
    ) {
      this.channelChatsSubscription.unsubscribe();
    }
  }
}
