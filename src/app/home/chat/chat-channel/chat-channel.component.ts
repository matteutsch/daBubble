import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddMembersComponent } from 'src/app/home/dialogs/dialog-add-members/dialog-add-members.component';
import { DialogEditChannelComponent } from 'src/app/home/dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogMembersComponent } from 'src/app/home/dialogs/dialog-members/dialog-members.component';
import { Chat, User } from 'src/app/models/models';
import { SelectService } from '../../shared/select.service';
import { ChatService } from '../../shared/chat.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.scss'],
})
export class ChatChannelComponent implements OnDestroy {
  @Input() drawerThread: any;
  @Input() currentUser!: User;
  channel!: Chat;
  channelMember: any[] = [];

  constructor(
    public dialog: MatDialog,
    public select: SelectService,
    public chatService: ChatService,
    public userService: UserService
  ) {
    this.loadChannelMember();
  }
  loadChannelMember() {
    this.select.selectedChannel$.subscribe((c) => {
      this.channel = c;
      this.channelMember = [];
      c.members.forEach((id: string) => {
        this.userService.getUser(id).forEach((e) => {
          if (!this.channelMember.some((member) => member.uid === e.uid)) {
            this.channelMember.push(e);
          }
        });
      });
    });
  }

  openEditChannelDialog(channel: Chat): void {
    const dialogRef = this.dialog.open(DialogEditChannelComponent, {
      panelClass: 'dialog-edit-channel',
      data: channel,
    });
    dialogRef.componentInstance.dataChange.subscribe((result) => {
      if (result) {
        this.chatService.updateChannel(this.channel.id, result);
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'leave') {
        this.chatService.deleteUserFromChannel(
          this.currentUser.uid,
          this.channel.id
        );
        console.log('CHANNEL VERLASSEN');
      }
    });
  }

  openMembersDialog(): void {
    const dialogRef = this.dialog.open(DialogMembersComponent, {
      panelClass: 'dialog-members',
      data: this.channelMember,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'add') {
        this.openAddMembersDialog(this.channel);
      }
    });
  }

  openAddMembersDialog(channelChat: Chat): void {
    const dialogRef = this.dialog.open(DialogAddMembersComponent, {
      panelClass: 'dialog-add-members',
      data: channelChat,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result !== null) {
        this.chatService.updateChannelMember(this.channel.id, result);
      }
    });
  }

  ngOnDestroy() {}
}
