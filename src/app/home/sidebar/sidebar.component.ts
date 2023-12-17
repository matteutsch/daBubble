import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChatService } from 'src/app/home/shared/chat.service';
import { Chat, User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import { DialogCreateChannelComponent } from '../dialogs/dialog-create-channel/dialog-create-channel.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnChanges {
  @Input() currentUser!: User;
  @Input() isMainChatChannel: any;

  showChannels: boolean = true;
  showDirectMessages: boolean = true;
  privateChatMembers: any[] = [];
  channelChats: Chat[] = [];

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    public userService: UserService
  ) {}

  ngOnChanges() {
    /*
      For the "user" object, a new property named "myChat" should be added.
      This property stores the ID of my private chat, which is located
      in the "privateChats" collection. This allows access to one's own
      private chats where only the user's messages are visible.*/
    // const chatMember = new privateChatMemberData(
    //   this.currentUser,
    //   this.currentUser.myChat
    // );
    // this.privateChatMembers.push(chatMember);
    //this.loadPrivateChats();
    this.pushPrivateChats();
    this.pushChannelChats();
  }

  pushPrivateChats() {
    if (this.currentUser.chats && this.currentUser.chats.private) {
      this.currentUser.chats.private.forEach((privateChat: any) => {
        const isAlreadyMember = this.privateChatMembers.some(
          (existingMember) => existingMember.uid === privateChat.uid
        );
        if (!isAlreadyMember) {
          this.privateChatMembers.push(privateChat);
        }
      });
    }
  }

  pushChannelChats() {
    if (this.currentUser.chats && this.currentUser.chats.channel) {
      this.currentUser.chats.channel.forEach((channel: any) => {
        const isAlreadyExisting = this.channelChats.some(
          (channelChat) => channelChat.id === channel.id
        );
        if (!isAlreadyExisting) {
          this.channelChats.push(channel);
        }
      });
    }
  }

  selectUser(selectedUser: any) {
    this.chatService.setCurrentChat(selectedUser.privateChatId, selectedUser);
    console.log(selectedUser.privateChatId);
  }

  selectChannel(selectedChannel: any) {
    this.chatService.setCurrentChannel(selectedChannel.id, selectedChannel);
    console.log(selectedChannel);
  }

  createChannelDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'dialog-create-channel';

    const dialogRef = this.dialog.open(
      DialogCreateChannelComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('The dialog was closed', result);
        this.chatService.updateChannelCollection(
          result.nameControl,
          result.descriptionControl,
          this.currentUser
        );
      }
    });
  }
}
