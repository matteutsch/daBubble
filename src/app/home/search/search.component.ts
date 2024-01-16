import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat, ChatMember, ChatMemberData, User } from 'src/app/models/models';
import { ChatService } from '../shared/chat.service';
import { SearchService } from '../shared/search.service';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SelectService } from '../shared/select.service';
import { PrivateChatService } from '../shared/private-chat.service';
import { ChannelChatService } from '../shared/channel-chat.service';
import { MessageService } from '../shared/message.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  public allUserChats!: Chat[];
  results$!: Observable<User[]>;

  constructor(
    private chatService: ChatService,
    public searchService: SearchService,
    private userService: UserService,
    private firestoreService: FirestoreService,
    private selectService: SelectService,
    private privateChatService: PrivateChatService,
    private channelChatService: ChannelChatService,
    private messageService: MessageService
  ) {}

  /**
   * Asynchronously performs a search and updates the list of user chats.
   *
   * @returns {Promise<void>} A promise indicating the success or failure of the search.
   */
  async search(): Promise<void> {
    if (this.searchService.searchTerm.length >= 3) {
      this.allUserChats = await this.searchService.searchUserChatsByTerm(
        this.channelChatService.uChannelChats,
        this.privateChatService.privateChatMembers,
        this.searchService.searchTerm
      );
    } else {
      this.allUserChats = [];
    }
  }

  /**
   * Asynchronously selects a chat from the dropdown based on its type.
   *
   * @param {Chat} chat - The selected chat.
   * @returns {Promise<void>} A promise indicating the success or failure of the chat selection.
   */
  async selectChatFromDropdown(chat: Chat): Promise<void> {
    this.searchService.searchTerm = '';
    if (chat.type === 'channel') {
      this.selectChannelChat(chat);
    } else if (chat.type === 'private') {
      const chatPartnerID = this.getChatPartnerId(
        chat,
        this.userService.user.uid
      );
      if (chatPartnerID) {
        this.openChatWithChatPartner(chatPartnerID, chat.chatID);
        this.chatService.chatType.next('private');
      }
    }
  }

  /**
   * Gets the ID of the chat partner based on the current user ID.
   *
   * @param {Chat} chat - The chat object.
   * @param {string} currentUserID - The ID of the current user.
   * @returns {string | undefined} The ID of the chat partner.
   */
  getChatPartnerId(chat: Chat, currentUserID: string): string | undefined {
    const partnerId = chat.members.find(
      (memberID) => memberID !== currentUserID
    );
    return partnerId;
  }

  /**
   * Selects a channel chat and updates the current chat and chat type.
   *
   * @param {Chat} chat - The selected channel chat.
   * @returns {void}
   */
  selectChannelChat(chat: Chat): void {
    this.chatService.currentChat = chat;
    this.messageService.getChatMessages(chat);
    this.chatService.pushMemberPhotoUrl(chat);
    this.chatService.chatType.next('channel');
    this.chatService.focusChatTextarea();
  }

  /**
   * Asynchronously opens a chat with a chat partner.
   *
   * @param {string} userId - The ID of the chat partner user.
   * @param {string} chatId - The ID of the chat.
   * @returns {Promise<void>} A promise indicating the success or failure of the chat opening.
   */
  async openChatWithChatPartner(userId: string, chatId: string): Promise<void> {
    const chatPartner = await this.createChatMemberFromUser(userId, chatId);
    this.selectPrivateChatWithMember(chatPartner);
  }

  /**
   * Asynchronously creates a ChatMember object from the user data.
   *
   * @private
   * @param {string} userId - The ID of the user.
   * @param {string} chatId - The ID of the chat.
   * @returns {Promise<ChatMember>} A promise that resolves to the created ChatMember object.
   */
  private async createChatMemberFromUser(
    userId: string,
    chatId: string
  ): Promise<ChatMember> {
    const user = await this.firestoreService.getDocumentFromCollection(
      'users',
      userId
    );
    return new ChatMemberData(user, chatId).toFirestoreObject();
  }

  /**
   * Selects a private chat with a specific member and updates the current chat and selected user in their respective services.
   *
   * @param {ChatMember} member - The member with whom the private chat is associated.
   * @returns {Promise<void>}
   */
  async selectPrivateChatWithMember(member: ChatMember): Promise<void> {
    if (member.chatID) {
      const chat = await this.firestoreService.getDocumentFromCollection(
        'privateChats',
        member.chatID
      );
      this.chatService.currentChat = chat;
      this.messageService.getChatMessages(chat);
      this.selectService.selectedUser.next(member);
      this.chatService.chatType.next('private');
      this.chatService.focusChatTextarea();
    }
  }
}
