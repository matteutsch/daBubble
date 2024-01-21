import { Component } from '@angular/core';
import { ChannelChat, Chat, ChatData } from 'src/app/models/models';
import { DialogEditChannelComponent } from '../../dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChatService } from '../../shared/chat.service';
import { DialogMembersComponent } from '../../dialogs/dialog-members/dialog-members.component';
import { DialogAddMembersComponent } from '../../dialogs/dialog-add-members/dialog-add-members.component';
import { UserService } from 'src/app/services/user.service';
import { SelectService } from '../../shared/select.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ChannelChatService } from '../../shared/channel-chat.service';

@Component({
  selector: 'app-header-channel-chat',
  templateUrl: './header-channel-chat.component.html',
  styleUrls: ['./header-channel-chat.component.scss'],
})
export class HeaderChannelChatComponent {
  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    public channelChatService: ChannelChatService,
    public userService: UserService,
    public selectService: SelectService,
    private firestoreService: FirestoreService
  ) {}

  openEditChannelDialog(chat: Chat): void {
    const dialogConfig = new MatDialogConfig();
    if (window.innerWidth <= 450) {
      dialogConfig.minWidth = '95vw';
    }
    dialogConfig.panelClass = 'dialog-edit-channel';
    dialogConfig.data = chat;
    const dialogRef = this.dialog.open(
      DialogEditChannelComponent,
      dialogConfig
    );

    dialogRef.componentInstance.dataChange.subscribe((res) => {
      if (res) {
        const currentChat = this.chatService.currentChat;
        if (currentChat.type === 'channel') {
          currentChat.name = res.nameControl;
          currentChat.description = res.descriptionControl;
        }
        this.channelChatService.updateChannel(
          currentChat.chatID,
          res,
          this.chatService.channelChatsCollection
        );
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'leave') {
        await this.channelChatService.deleteChannelChatFromUser(
          this.userService.user,
          this.chatService.currentChat.chatID
        );
        this.chatService.updateChannelChatCollection(
          this.userService.user,
          this.chatService.currentChat.chatID
        );
        this.chatService.currentChat = new ChatData();
      }
    });
  }

  openMembersDialog(): void {
    const dialogConfig = new MatDialogConfig();
    if (window.innerWidth <= 450) {
      dialogConfig.minWidth = '95vw';
    }
    dialogConfig.panelClass = 'dialog-members';
    dialogConfig.data = this.chatService.currentChat.members;
    const dialogRef = this.dialog.open(DialogMembersComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'add') {
        this.openAddMembersDialog(this.chatService.currentChat);
      }
    });
  }

  openAddMembersDialog(chat: Chat): void {
    const dialogConfig = new MatDialogConfig();
    if (window.innerWidth <= 450) {
      dialogConfig.minWidth = '95vw';
    }
    dialogConfig.panelClass = 'dialog-add-members';
    dialogConfig.data = chat;
    const dialogRef = this.dialog.open(DialogAddMembersComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (memberID: string) => {
      this.handleMemberDialogClosed(memberID);
    });
  }

  /**
   * Handles the closure of the member dialog and updates the channel accordingly.
   *
   * @param {string} memberID - The ID of the selected member.
   * @returns {Promise<void>} A promise that resolves when the processing is complete.
   */
  async handleMemberDialogClosed(memberID: string): Promise<void> {
    if (memberID !== undefined && memberID !== null) {
      const channelId = this.chatService.currentChat.chatID;
      const channelMembers: string[] = await this.getChannelMembers(channelId);
      const isMember = channelMembers.includes(memberID);
      if (!isMember) {
        const channel: ChannelChat[] =
          await this.channelChatService.getUpdatedChannel(memberID, channelId);
        await this.channelChatService.updateChannelMembers(
          memberID,
          channelId,
          this.chatService.channelChatsCollection,
          this.chatService.currentChat
        );
        await this.channelChatService.updateMemberChannel(memberID, channel);
        this.chatService.selectChannelChat(this.chatService.currentChat);
      } else {
        console.log(
          `Member with ID ${memberID} is already a member of the channel.`
        );
      }
    }
  }

  /**
   * Retrieves the members of a channel.
   *
   * @param {string} channelId - The ID of the channel.
   * @returns {Promise<string[]>} A promise that resolves with an array of member IDs of the channel.
   */
  async getChannelMembers(channelId: string): Promise<string[]> {
    return this.firestoreService.getPropertyFromDocument(
      'channelChats',
      channelId,
      'members'
    );
  }
}
