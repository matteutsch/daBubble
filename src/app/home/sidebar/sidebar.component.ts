import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from '../dialogs/dialog-create-channel/dialog-create-channel.component';
import { ChatService } from 'src/app/home/shared/chat.service';
import { Chats } from 'src/app/models/models';
import { User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnChanges {
  @Input() currentUser!: User;
  @Input() isMainChatChannel: any;
  @Input() chats!: Chats;

  users: User[] = [];

  showChannels: boolean = true;
  showDirectMessages: boolean = true;

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    public userService: UserService
  ) {}

  ngOnChanges() {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users.filter((user) => user.uid !== this.currentUser.uid);
    });
  }

  createChannelDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateChannelComponent, {
      panelClass: 'dialog-create-channel'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  selectUser(selectedUser: User, currentUser: User) {
    this.chatService.setPrivateChat(selectedUser, currentUser);
  }
}
