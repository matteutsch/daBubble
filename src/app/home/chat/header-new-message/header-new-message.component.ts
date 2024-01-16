import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  Chat,
  ChatMember,
  ChatMemberData,
  PrivateChat,
  User,
} from 'src/app/models/models';
import { SearchService } from '../../shared/search.service';
import { ChatService } from '../../shared/chat.service';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SelectService } from '../../shared/select.service';
import { PrivateChatService } from '../../shared/private-chat.service';
import { ChannelChatService } from '../../shared/channel-chat.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MessageService } from '../../shared/message.service';

@Component({
  selector: 'app-header-new-message',
  templateUrl: './header-new-message.component.html',
  styleUrls: ['./header-new-message.component.scss'],
})
export class HeaderNewMessageComponent implements AfterViewInit {
  @ViewChild('inputSearchChat', { static: false })
  inputSearchChatRef!: ElementRef;

  public searchTerm: string = '';
  public users: User[] = [];
  public channels: Chat[] = [];

  constructor(
    private searchService: SearchService,
    private chatService: ChatService,
    private privateChatService: PrivateChatService,
    private channelChatService: ChannelChatService,
    private messageService: MessageService,
    private userService: UserService,
    private selectService: SelectService,
    private firestoreService: FirestoreService,
    private afs: AngularFirestore
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await this.chatService.setInputSearchChatRef(this.inputSearchChatRef);
    this.chatService.focusInputSearchChat();
  }

  /**
   * Initiates the search based on the entered search term and determines whether to search for users or channels.
   *
   */
  search(): void {
    if (this.searchTerm.startsWith('@')) {
      this.searchUsers();
    } else if (this.searchTerm.startsWith('#')) {
      this.searchChannel();
    } else {
      this.users = [];
      this.channels = [];
    }
  }

  /**
   * Searches for channels based on the cleaned search term.
   *
   */
  searchChannel(): void {
    const cleanedSearchTerm = this.searchTerm.startsWith('#')
      ? this.searchTerm.substring(1)
      : this.searchTerm;
    if (cleanedSearchTerm.length >= 3) {
      this.channels = this.searchService.getChannelsByTerm(cleanedSearchTerm);
    } else {
      this.channels = [];
    }
  }

  /**
   * Selects a channel from the dropdown and handles the necessary actions such as adding a member to the channel and updating the UI.
   *
   * @param {Chat} channel - The selected channel.
   * @returns {Promise<void>} A promise indicating the success or failure of the operation.
   */
  async selectChannelFromDropdown(channel: Chat): Promise<void> {
    this.searchTerm = '';
    const user = this.userService.user;
    if (
      !this.channelChatService.isChannelChatAlreadyExists(
        channel.chatID,
        this.userService.user
      )
    ) {
      await this.addMemberToChannelChat(channel, user);
      this.channelChatService.uChannelChats.push(channel);
      this.channelChatService.updateUserChannel(channel.chatID, user);
      this.chatService.selectChannelChat(channel);
    }
    this.selectChannelChat(channel);
  }

  /**
   * Asynchronously adds a user to the members list of a channel chat in Firestore.
   *
   * @param {Chat} channel - The channel object representing the chat.
   * @param {User} user - The user object to be added to the channel's members list.
   * @returns {Promise<void>} A promise indicating the success or failure of the operation.
   *
   * @throws {Error} If there is an issue adding the user to the channel.
   */
  async addMemberToChannelChat(channel: Chat, user: User): Promise<void> {
    try {
      const members = channel.members || [];
      if (!members.includes(user.uid)) {
        members.push(user.uid);
        await this.afs
          .collection('channelChats')
          .doc(channel.chatID)
          .update({
            members: members,
          } as Partial<Chat>);
      }
    } catch (error) {
      console.error('Error adding the user to the channel:', error);
      throw new Error('Failed to add the user to the channel.');
    }
  }

  /**
   * Selects a channel chat and updates the current chat and chat type.
   *
   * @param {Chat} chat - The selected channel chat.
   */
  selectChannelChat(chat: Chat): void {
    this.chatService.currentChat = chat;
    this.messageService.getChatMessages(chat);
    this.chatService.pushMemberPhotoUrl(chat);
    this.chatService.chatType.next('channel');
    this.chatService.focusChatTextarea();
  }

  /**
   * Searches for users based on the entered search term.
   * If the search term has at least 3 characters, it retrieves users
   * from the search service and updates the users array; otherwise, it clears the users array.
   */
  searchUsers(): void {
    const cleanedSearchTerm = this.searchTerm.startsWith('@')
      ? this.searchTerm.substring(1)
      : this.searchTerm;
    if (cleanedSearchTerm.length >= 3) {
      this.users = this.searchService.getUsersByTerm(cleanedSearchTerm);
    } else {
      this.users = [];
    }
  }

  /**
   * Asynchronously selects a user from a dropdown, clears the search term, and opens a private chat with the selected user.
   *
   * @param {User} user - The user selected from the dropdown.
   * @returns {Promise<void>} A Promise that resolves once the private chat is opened.
   */
  async selectUserFromDropdown(user: User): Promise<void> {
    this.searchTerm = '';
    if (
      !this.privateChatService.isPrivateChatAlreadyExists(
        user.uid,
        this.userService.user
      )
    ) {
      const newChatData: Chat =
        this.privateChatService.createPrivateChatForCollection(
          user,
          this.userService.user
        );
      const chatMember = new ChatMemberData(user, newChatData.chatID);
      await this.privateChatService.setPrivateDoc(
        user,
        this.userService.user,
        this.chatService.privateChatsCollection,
        newChatData
      );
      this.privateChatService.privateChatMembers.push(chatMember);
    }
    this.openChatWithChatPartner(user);
  }

  /**
   * Asynchronously opens a private chat with the specified chat partner.
   *
   * @param {User} user - The user representing the chat partner.
   * @returns {Promise<void>} A Promise that resolves once the private chat is opened.
   */
  async openChatWithChatPartner(user: User): Promise<void> {
    const chatId = this.findPrivateChatId(user);
    const chatPartner = await this.createChatMemberFromUser(user.uid, chatId);
    this.selectPrivateChatWithMember(chatPartner);
  }

  /**
   * Finds the private chat ID associated with a given channel member.
   *
   * @private
   * @param {User} user - The user for which to find the private chat ID.
   * @returns {string} The private chat ID, or an empty string if not found.
   */
  private findPrivateChatId(user: User): string {
    const privateChats = this.userService.user.chats.private;
    return (
      privateChats.find((chat: PrivateChat) => chat.chatPartnerID === user.uid)
        ?.chatID || ''
    );
  }

  /**
   * Asynchronously creates a ChatMember object from the user data for a given user ID and chat ID.
   *
   * @private
   * @param {string} userId - The user ID for which to fetch the user data.
   * @param {string} chatId - The chat ID associated with the user.
   * @returns {Promise<ChatMember>} A Promise that resolves to the created ChatMember object.
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
