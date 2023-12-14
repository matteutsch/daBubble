import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from 'src/app/home/shared/chat.service';
import { Chat, Chats, User } from 'src/app/models/models';
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
  @Input() chats!: Chats;

  privateChats: Chat[] = [];

  showChannels: boolean = true;
  showDirectMessages: boolean = true;

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    public userService: UserService
  ) {}

  ngOnChanges() {
    if (this.chats) {
      this.privateChats = this.chats.private;
      console.log(this.currentUser.uid);
    }
  }

  createChannelDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateChannelComponent, {
      panelClass: 'dialog-create-channel',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  selectUser(selectedUser: User, currentUser: User) {
    this.chatService.setPrivateChat(selectedUser, currentUser);
  }
}
