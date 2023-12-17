import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from 'src/app/home/shared/chat.service';
import {
  Chats,
  PrivatChatMember,
  User,
} from 'src/app/models/models';
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

  privateChats: string[] = []; //currentUser's privateChats 1
  showChannels: boolean = true;
  showDirectMessages: boolean = true;
  privateChatMembers: PrivatChatMember[] = [];

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
    this.loadPrivateChats();
  }

  /**
   * Loads private chats for the current user.
   * Iterates through the private chat IDs of the current user and ensures unique private chats are added.
   * Additionally retrieves and adds members from the newly added private chats.
   */
  loadPrivateChats() {
    // Check if the current user has private chats.
    if (this.currentUser.chats && this.currentUser.chats.private) {
      // Iterate through each private chat ID of the current user.
      for (let chatID of this.currentUser.chats.private) {
        // Add the unique private chat to the privateChats array and retrieve its members.
        this.chatService.addUniquePrivateChats(
          chatID,
          this.privateChats,
          this.currentUser,
          this.privateChatMembers
        );
      }
    }
  }

  selectUser(selectedUser: PrivatChatMember, currentUser: User) {
    this.chatService.openPrivateChat(selectedUser, currentUser);
    this.chatService.setCurrentChat(selectedUser.chatId);
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
