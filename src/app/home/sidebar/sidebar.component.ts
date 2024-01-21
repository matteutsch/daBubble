import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChatService } from 'src/app/home/shared/chat.service';
import { Chat, ChatData, ChatMember } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import { DialogCreateChannelComponent } from '../dialogs/dialog-create-channel/dialog-create-channel.component';
import { SelectService } from '../shared/select.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DrawerService } from '../shared/drawer.service';
import { ChannelChatService } from '../shared/channel-chat.service';
import { PrivateChatService } from '../shared/private-chat.service';
import { MessageService } from '../shared/message.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() drawerThread: any;
  @Input() drawerSidebar: any;
  innerWidth: number = window.innerWidth;
  public showChannels: boolean = true;
  public showDirectMessages: boolean = true;

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    public userService: UserService,
    public selectService: SelectService,
    private firestoreService: FirestoreService,
    private drawerService: DrawerService,
    public channelChatService: ChannelChatService,
    public privateChatService: PrivateChatService,
    private messageService: MessageService
  ) {
    this.drawerService.getResizeObservable().subscribe((width) => {
      this.innerWidth = width;
    });
  }

  /**
   * Selects a channel chat and updates the current chat in the chat service.
   *
   * @param {Chat} chat - The channel chat to be selected.
   * @returns {void}
   */
  selectChannelChat(chat: Chat): void {
    this.chatService.selectChannelChat(chat);
    this.messageService.getChatMessages(chat);
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

  /**
   * Resets the current chat selection by updating the current chat in the chat service with an empty chat.
   *
   * @returns {Promise<void>}
   */
  async resetChatSelection(): Promise<void> {
    this.chatService.currentChat = new ChatData();
    this.messageService.currentMessages = [];
    this.chatService.chatType.next('default');
    await this.drawerService.closeDrawer(this.drawerThread);
  }

  createChannelDialog(): void {
    const dialogConfig = new MatDialogConfig();
    if (this.innerWidth <= 450) {
      dialogConfig.minWidth = '95vw';
    }
    dialogConfig.panelClass = 'dialog-create-channel';
    const dialogRef = this.dialog.open(
      DialogCreateChannelComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const isChatNameExisted = await this.chatService.isChatNameExisted(
          result.name,
          this.chatService.channelChatsCollection
        );
        if (!isChatNameExisted) {
          const newChannel: Chat =
            this.channelChatService.createChannelForCollection(
              result.nameControl,
              result.descriptionControl,
              this.userService.user
            );
          await this.channelChatService.setChannelDoc(
            newChannel,
            this.userService.user,
            this.chatService.channelChatsCollection
          );
          this.channelChatService.uChannelChats.push(newChannel);
          this.selectChannelChat(newChannel);
        } else {
          console.log(
            `The channel name "${result.nameControl}" already exists.`
          );
        }
      }
    });
  }

  hideSideBar() {
    if (this.innerWidth < 800) {
      this.drawerService.closeDrawer(this.drawerSidebar!);
    }
  }
}
