import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddMembersComponent } from 'src/app/home/dialogs/dialog-add-members/dialog-add-members.component';
import { DialogEditChannelComponent } from 'src/app/home/dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogMembersComponent } from 'src/app/home/dialogs/dialog-members/dialog-members.component';
import { Chat, User } from 'src/app/models/models';
import { SelectService } from '../../shared/select.service';
import { ChatService } from '../../shared/chat.service';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.scss'],
})
export class ChatChannelComponent {
  @Input() drawerThread: any;
  channel!: Chat;
  channelMember!: User;
  constructor(
    public dialog: MatDialog,
    public select: SelectService,
    public chatService: ChatService
  ) {
    this.select.selectedChannel$.subscribe((c) => {
      this.channel = c;
      console.log(this.channel.members);
    });
  }

  //TODO: splice member from channel & update
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
        console.log('CHANNEL VERLASSEN');
      }
    });
  }
  //TODO:show member names, link to dialogaddmembercomponent
  openMembersDialog(channelChat: Chat): void {
    const dialogRef = this.dialog.open(DialogMembersComponent, {
      panelClass: 'dialog-members',
      data: channelChat,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
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
}
