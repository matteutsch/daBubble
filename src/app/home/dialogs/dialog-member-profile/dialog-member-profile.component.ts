import { Component, Inject, OnInit } from '@angular/core';
import {
  ChatMember,
  ChatMemberData,
  PrivateChat,
} from 'src/app/models/models';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChatService } from '../../shared/chat.service';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SelectService } from '../../shared/select.service';
import { MessageService } from '../../shared/message.service';

@Component({
  selector: 'app-dialog-member-profile',
  templateUrl: './dialog-member-profile.component.html',
  styleUrls: ['./dialog-member-profile.component.scss'],
})
export class DialogMemberProfileComponent implements OnInit {
  member: ChatMember = new ChatMemberData();

  constructor(
    public dialogRef: MatDialogRef<DialogMemberProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChatMember,
    public dialog: MatDialog,
    private chatService: ChatService,
    private messageService: MessageService,
    private userService: UserService,
    private firestoreService: FirestoreService,
    private selectService: SelectService
  ) {}

  ngOnInit() {
    this.member = this.data;
  }

  /**
   * Asynchronously closes the current dialog, focuses the textarea, finds the private chat ID for a given channel member,
   * creates a ChatMember object from the user data, and selects the private chat with the specified member.
   *
   * @param {ChatMember} channelMember - The member associated with the private chat.
   * @returns {Promise<void>} A Promise that resolves once the operations are completed.
   */
  async close(channelMember: ChatMember): Promise<void> {
    this.closeDialogsAndFocusTextarea();
    const chatId = this.findPrivateChatId(channelMember);
    const chatPartner = await this.createChatMemberFromUser(
      channelMember.uid,
      chatId
    );
    this.selectPrivateChatWithMember(chatPartner);
  }

  /**
   * Closes the current dialog, closes all dialogs, and focuses the textarea.
   *
   * @private
   * @returns {void}
   */
  private closeDialogsAndFocusTextarea(): void {
    this.dialogRef.close();
    this.dialog.closeAll();
    this.chatService.focusChatTextarea();
  }

  /**
   * Finds the private chat ID associated with a given channel member.
   *
   * @private
   * @param {ChatMember} channelMember - The channel member to find the private chat ID for.
   * @returns {string} The private chat ID, or an empty string if not found.
   */
  private findPrivateChatId(channelMember: ChatMember): string {
    const privateChats = this.userService.user.chats.private;
    return (
      privateChats.find(
        (chat: PrivateChat) => chat.chatPartnerID === channelMember.uid
      )?.chatID || ''
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
