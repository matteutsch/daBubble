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
  privateChatMembers: User[] = [];

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    public userService: UserService
  ) {}

  async ngOnChanges() {
    await this.loadPrivateChats();
    await this.getMemberFromChats();
  }

  async loadPrivateChats() {
    if (this.currentUser.chats && this.currentUser.chats.private) {
      for (let chatID of this.currentUser.chats.private) {
        await this.loadPrivateChat(chatID);
      }
    }
  }

  async loadPrivateChat(chatID: string) {
    this.chatService.getPrivateChat(chatID).subscribe((chat) => {
      const chatExists = this.privateChats.some(
        (existingChat) => JSON.stringify(existingChat) === JSON.stringify(chat)
      );
      if (!chatExists) {
        this.privateChats.push(chat);
      }
    });
  }

  async getMemberFromChats() {
    this.privateChats.forEach((user: any) => {
      user.members.forEach((memberID: string) => {
        if (this.currentUser.uid !== memberID) {
          this.loadPrivateChatsMember(memberID);
        }
      });
    });
  }

  loadPrivateChatsMember(memberID: string) {
    this.userService.getUser(memberID).subscribe((member) => {
      if(this.isNotMember(member.uid)) {
        this.privateChatMembers.push(member);
      }
    });
  }

  isNotMember(memberID: string): boolean {
    return !this.privateChatMembers.some((member) => member.uid === memberID);
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
