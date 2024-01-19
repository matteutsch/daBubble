import { ElementRef, Injectable } from '@angular/core';
import {
  ChannelChat,
  Chat,
  ChatData,
  ChatMember,
  PrivateChat,
  User,
} from 'src/app/models/models';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PrivateChatService } from './private-chat.service';
import { ChannelChatService } from './channel-chat.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public currentChat: Chat = new ChatData();
  public chatType = new BehaviorSubject('default');
  public chatMemberPhotoUrls = new BehaviorSubject<string[]>([]);
  public privateChatsCollection: AngularFirestoreCollection<Chat>;
  public channelChatsCollection: AngularFirestoreCollection<Chat>;
  private customTextAreaRef: any;
  private customThreadTextareaRef: any;
  private inputSearchChatRef: any;

  constructor(
    private afs: AngularFirestore,
    private firestoreService: FirestoreService,
    private privateChatService: PrivateChatService,
    private channelChatService: ChannelChatService,
    private messageService: MessageService
  ) {
    this.privateChatsCollection = this.afs.collection('privateChats');
    this.channelChatsCollection = this.afs.collection('channelChats');
    this.channelChatService.getAllChannels(this.channelChatsCollection);
  }

  /**
   * Clears and updates all private and channel chats for the specified user.
   *
   * @param {User} user - The user for whom the chats are updated.
   * @returns {void}
   */
  public updateAllChats(user: User): void {
    this.resetAllChats();
    user.chats.private.forEach(async (chat: PrivateChat) => {
      await this.privateChatService.pushMemberInPrivateChat(
        chat.chatPartnerID,
        chat.chatID
      );
    });
    user.chats.channel.forEach((chat: ChannelChat) => {
      this.channelChatService.pushChatInChannel(
        chat.chatID,
        this.channelChatsCollection
      );
    });
  }

  /**
   * Resets all private and channel chats data.
   *
   * @returns {void}
   * @private
   */
  private resetAllChats(): void {
    this.privateChatService.privateChatMembers = [] as ChatMember[];
    this.channelChatService.uChannelChats = [] as Chat[];
  }

  /**
   * Selects a channel chat, updates relevant information, and focuses on the chat textarea.
   *
   * @param {Chat} chat - The selected channel chat.
   * @returns {void}
   */
  public selectChannelChat(chat: Chat): void {
    this.currentChat = chat;
    this.pushMemberPhotoUrl(this.currentChat);
    this.chatType.next('channel');
    this.focusChatTextarea();
  }

  /**
   * Asynchronously retrieves member photo URLs for a given chat and updates the observable.
   *
   * @param {Chat} chat - The chat for which member photo URLs are retrieved.
   * @returns {Promise<void>}
   */
  public async pushMemberPhotoUrl(chat: Chat): Promise<void> {
    const memberIDs = chat.members || [];
    const promises = memberIDs.map(async (memberID: string) => {
      const photoUrl: string =
        await this.firestoreService.getPropertyFromDocument(
          'users',
          memberID,
          'photoURL'
        );
      return photoUrl;
    });
    const photoUrls: string[] = await Promise.all(promises);
    this.chatMemberPhotoUrls.next(photoUrls);
  }

  /**
   * Checks if a chat name already exists in the specified Firestore collection.
   *
   * @param {string} name - The name to check for existence.
   * @param {AngularFirestoreCollection} collection - The Firestore collection to check against.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating name existence.
   */
  public async isChatNameExisted(
    name: string,
    collection: AngularFirestoreCollection
  ): Promise<boolean> {
    try {
      const querySnapshot = await lastValueFrom(collection.get());
      const channelChats = querySnapshot.docs.map((doc) => doc.data() as Chat);
      return channelChats.some((channel) => channel.name === name);
    } catch (error) {
      console.error('Error checking channel name existence:', error);
      return false;
    }
  }

  /**
   * Asynchronously updates the Firestore collection for a channel chat.
   *
   * @param {User} user - The user initiating the update.
   * @param {string} chatID - The ID of the channel chat to update.
   * @returns {Promise<void>}
   */
  public async updateChannelChatCollection(
    user: User,
    chatID: string
  ): Promise<void> {
    try {
      let members: any = null;
      const createdBy = await this.firestoreService.getPropertyFromDocument(
        'channelChats',
        chatID,
        'createdBy'
      );
      const chat = await this.firestoreService.getDocumentFromCollection(
        'channelChats',
        chatID
      );
      if (user.uid === createdBy) {
        this.handleCreatedByUser(chat, chatID);
      } else {
        this.handleNonCreatedByUser(chat, user.uid);
        members = chat.members;
      }
      await this.updateChannelChatFirestore(chatID, members);
    } catch (error) {
      console.error(`Error updating channel chat collection: ${error}`);
      throw new Error('Failed to update channel chat collection.');
    }
  }

  /**
   * Handles deletion of channel chat from users when the chat is created by the current user.
   *
   * @param {Chat} chat - The channel chat being handled.
   * @param {string} chatID - The ID of the channel chat.
   * @returns {void}
   * @private
   */
  private handleCreatedByUser(chat: Chat, chatID: string): void {
    chat.members?.forEach(async (memberID: string) => {
      const member: User =
        await this.firestoreService.getDocumentFromCollection(
          'users',
          memberID
        );
      this.channelChatService.deleteChannelChatFromUser(member, chatID);
    });
  }

  /**
   * Handles removal of the current user from the channel chat members list.
   *
   * @param {Chat} chat - The channel chat being handled.
   * @param {string} userID - The ID of the current user.
   * @returns {void}
   * @private
   */
  private handleNonCreatedByUser(chat: Chat, userID: string): void {
    chat.members?.forEach((memberID: string, index: number) => {
      if (memberID === userID) {
        chat.members?.splice(index, 1);
      }
    });
  }

  /**
   * Updates the Firestore collection for a channel chat with the specified ID and members.
   * If members is null, the chat is deleted from the collection.
   *
   * @param {string} chatID - The ID of the channel chat to update.
   * @param {any} members - The members of the channel chat.
   * @returns {Promise<void>}
   * @private
   */
  private async updateChannelChatFirestore(
    chatID: string,
    members: any
  ): Promise<void> {
    try {
      if (members === null) {
        await this.channelChatsCollection.doc(chatID).delete();
      } else {
        await this.channelChatsCollection.doc(chatID).update({
          members: members,
        });
      }
    } catch (error) {
      console.error(`Error updating Firestore collection: ${error}`);
      throw new Error('Failed to update Firestore collection.');
    }
  }

  /**
   * Scrolls the specified chat element to the bottom.
   *
   * @param {HTMLElement} element - The HTML element representing the chat.
   * @returns {void}
   */
  public scrollChatToBottom(element: HTMLElement): void {
    if (element) {
      element.scrollTop = element.scrollHeight;
    } else {
      console.error('Element reference not available.');
    }
  }

  /**
   * Sets the reference to the custom text area.
   *
   * @param {ElementRef} ref - The reference to the custom text area.
   * @returns {void}
   */
  public setTextareaRef(ref: ElementRef): void {
    this.customTextAreaRef = ref;
  }

  /**
   * Gets the reference to the custom text area.
   *
   * @returns {any} - The reference to the custom text area.
   * @private
   */
  private getTextareaRef(): any {
    return this.customTextAreaRef;
  }

  /**
   * Focuses on the custom chat text area.
   *
   * @returns {void}
   */
  public focusChatTextarea(): void {
    const customTextAreaRef = this.getTextareaRef().textArea;
    customTextAreaRef.nativeElement.focus();
  }

  /**
   * Sets the reference to the custom thread text area.
   *
   * @param {ElementRef} ref - The reference to the custom thread text area.
   * @returns {void}
   */
  public setThreadTextareaRef(ref: ElementRef): void {
    this.customThreadTextareaRef = ref;
  }

  /**
   * Gets the reference to the custom thread text area.
   *
   * @returns {any} - The reference to the custom thread text area.
   * @private
   */
  private getThreadTextareaRef(): any {
    return this.customThreadTextareaRef;
  }

  /**
   * Focuses on the custom thread text area.
   *
   * @returns {void}
   */
  public focusThreadTextarea(): void {
    const customThreadTextareaRef = this.getThreadTextareaRef().textArea;
    customThreadTextareaRef.nativeElement.focus();
  }

  /**
   * Asynchronously sets the reference to the input used for searching chats.
   *
   * @param {ElementRef} ref - The reference to the input used for searching chats.
   * @returns {Promise<void>}
   */
  public async setInputSearchChatRef(ref: ElementRef): Promise<void> {
    this.inputSearchChatRef = ref;
  }

  /**
   * Gets the reference to the input used for searching chats.
   *
   * @returns {any} - The reference to the input used for searching chats.
   * @private
   */
  private getInputSearchChatRef(): any {
    return this.inputSearchChatRef;
  }

  /**
   * Focuses on the input used for searching chats.
   *
   * @returns {void}
   */
  public focusInputSearchChat(): void {
    const inputSearchChatRef = this.getInputSearchChatRef();
    inputSearchChatRef.nativeElement.focus();
  }

  /**
   * Unsubscribes from all chat-related subscriptions, including private chats,
   * channel chats, and messages.
   *
   * @returns {void}
   */
  public unsubscribeChat(): void {
    this.privateChatService.unsubscribePrivateChats();
    this.channelChatService.channelChatsSubscription.unsubscribe();
    this.messageService.messageSubscription.unsubscribe();
  }
}
