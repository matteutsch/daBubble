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
  @Input() chats!: Chats; //curretUser's Chats

  privateChats: string[] = []; //currentUser's privateChats
  showChannels: boolean = true;
  showDirectMessages: boolean = true;
  privateChatMember: User[] = [];

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    public userService: UserService
  ) {}

  ngOnChanges() {
    //get currentUsers privatechats and push them into privateChats[] for further usage
    if (this.currentUser && this.currentUser.chats.private) {
      for (let chatID of this.currentUser.chats.private) {
        this.chatService.getPrivateChat(chatID).subscribe((chat) => {
          const chatExists = this.privateChats.some(
            (existingChat) =>
              JSON.stringify(existingChat) === JSON.stringify(chat)
          );

          if (!chatExists) {
            this.privateChats.push(chat);
            console.log(this.privateChats);
            this.getMemberFromChats(this.currentUser.uid);
          }
        });
      }
    }
  }
  //TODO: get all existing member from privateChats[] (!!except currentUser!!) to render in privateChatMember [] line 21
  getMemberFromChats(userId: string) {
    let result = this.privateChats.find((chat) => chat === userId);
    console.log(result);
  }

  selectUser(selectedUser: User, currentUser: User) {
    this.chatService.openPrivateChat(selectedUser, currentUser);
  }

  createChannelDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateChannelComponent, {
      panelClass: 'dialog-create-channel',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
