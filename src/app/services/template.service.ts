import { Injectable } from '@angular/core';
import {
  ChannelChatData,
  Chat,
  ChatData,
  PrivateChatData,
  User,
} from '../models/models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private templatePrivateChatsData: any = [
    /* 
      {
        privateChatPartnerId: '', // Enter the user ID with whom you want to have a private chat
        newChatId: this.afs.createId(),
      }
    */
  ];

  private templateChannelChatData: string[] = [
    /*
      '' // Enter the channel chat ID
    */
  ];

  constructor(
    private afs: AngularFirestore,
    private firestoreService: FirestoreService
  ) {}

  /**
   * Sets template chats to the user data.
   *
   * @param {User} userData - The user data to update with template chats.
   * @returns {Promise<void>}
   */
  public async setChatsTemplateToUser(userData: User): Promise<void> {
    this.templatePrivateChatsData.forEach((template: any) => {
      this.setPrivateChatToUser(
        userData,
        template.privateChatPartnerId,
        template.newChatId
      );
    });
    this.templateChannelChatData.forEach((channelChatId: string) => {
      this.setChannelChatToUser(userData, channelChatId);
    });
  }

  /**
   * Sets a private chat to the user data.
   *
   * @private
   * @param {User} userData - The user data to update.
   * @param {string} privateChatPartnerId - The ID of the private chat partner.
   * @param {string} newChatId - The ID of the new private chat.
   * @returns {void}
   */
  private setPrivateChatToUser(
    userData: User,
    privateChatPartnerId: string,
    newChatId: string
  ): void {
    const newPrivateChat = new PrivateChatData(
      newChatId,
      privateChatPartnerId
    ).toFirestoreObject();
    userData.chats.private.push(newPrivateChat);
    this.setPrivateChatToPartner(privateChatPartnerId, newChatId, userData.uid);
    this.setPrivateChatToColection(newChatId, userData, privateChatPartnerId);
  }

  /**
   * Sets a private chat to the partner's user data.
   *
   * @private
   * @param {string} partnerId - The ID of the private chat partner.
   * @param {string} newChatId - The ID of the new private chat.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<void>}
   */
  private async setPrivateChatToPartner(
    partnerId: string,
    newChatId: string,
    userId: string
  ): Promise<void> {
    const partnerUser = (await this.firestoreService.getDocumentFromCollection(
      'users',
      partnerId
    )) as User;
    const newPrivateChat = new PrivateChatData(
      newChatId,
      userId
    ).toFirestoreObject();
    const privateChats = partnerUser.chats.private;
    privateChats.push(newPrivateChat);
    this.afs
      .collection('users')
      .doc(partnerUser.uid)
      .update({
        'chats.private': privateChats,
      } as Partial<User>);
  }

  /**
   * Sets a private chat to the Firestore collection.
   *
   * @private
   * @param {string} newChatId - The ID of the new private chat.
   * @param {User} user - The user data.
   * @param {string} privateChatPartnerId - The ID of the private chat partner.
   * @returns {void}
   */
  private setPrivateChatToColection(
    newChatId: string,
    user: User,
    privateChatPartnerId: string
  ): void {
    const newChatData = new ChatData(newChatId, user);
    newChatData.setType('private');
    newChatData.members.push(privateChatPartnerId);
    this.afs
      .collection('privateChats')
      .doc(newChatData.toFirestoreObject().chatID)
      .set(newChatData.toFirestoreObject());
  }

  /**
   * Sets a channel chat to the user data.
   *
   * @private
   * @param {User} userData - The user data to update.
   * @param {string} channelChatId - The ID of the channel chat.
   * @returns {void}
   */
  private setChannelChatToUser(userData: User, channelChatId: string): void {
    const newChannelChat = new ChannelChatData(
      channelChatId
    ).toFirestoreObject();
    userData.chats.channel.push(newChannelChat);
    this.setUserToChannelChat(channelChatId, userData.uid);
  }

  /**
   * Sets a user to the channel chat.
   *
   * @private
   * @param {string} channelChatId - The ID of the channel chat.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<void>}
   */
  private async setUserToChannelChat(
    channelChatId: string,
    userId: string
  ): Promise<void> {
    const channelChat = (await this.firestoreService.getDocumentFromCollection(
      'channelChats',
      channelChatId
    )) as Chat;
    const members = channelChat.members || [];
    members.push(userId);
    this.afs
      .collection('channelChats')
      .doc(channelChatId)
      .update({
        members: members,
      } as Partial<Chat>);
  }
}
