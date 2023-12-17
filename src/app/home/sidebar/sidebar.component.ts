import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from 'src/app/home/shared/chat.service';
import { Chats, User } from 'src/app/models/models';
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

  showChannels: boolean = true;
  showDirectMessages: boolean = true;
  privateChatMembers: any[] = [];

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
    if (this.currentUser.chats && this.currentUser.chats.private) {
      this.currentUser.chats.private.forEach((privateChat: any) => {
        const isAlreadyMember = this.privateChatMembers.some(
          (existingMember) => existingMember.uid === privateChat.uid
        );
        if (!isAlreadyMember) {
          this.privateChatMembers.push(privateChat);
          console.log('privateChat,', this.privateChatMembers);
        }
      });
    }
  }

  selectUser(selectedUser: any) {
    this.chatService.setCurrentChat(selectedUser.privateChatId, selectedUser);
    console.log(selectedUser.privateChatId);
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
