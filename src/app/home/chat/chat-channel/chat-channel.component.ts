import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddMembersComponent } from 'src/app/home/dialogs/dialog-add-members/dialog-add-members.component';
import { DialogEditChannelComponent } from 'src/app/home/dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogMembersComponent } from 'src/app/home/dialogs/dialog-members/dialog-members.component';
import { Chat } from 'src/app/models/models';
import { SelectService } from '../../shared/select.service';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.scss'],
})
export class ChatChannelComponent {
  @Input() drawerThread: any;
  channel!: Chat;
  constructor(public dialog: MatDialog, public select: SelectService) {
    this.select.selectedChannel$.subscribe((u) => {
      this.channel = u;
      console.log('channel', this.channel);
    });
  }

  openEditChannelDialog(channelChat: Chat): void {
    const dialogRef = this.dialog.open(DialogEditChannelComponent, {
      panelClass: 'dialog-edit-channel',
      data: channelChat,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openMembersDialog(channelChat: Chat): void {
    const dialogRef = this.dialog.open(DialogMembersComponent, {
      panelClass: 'dialog-members',
      data: channelChat,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openAddMembersDialog(channelChat: Chat): void {
    const dialogRef = this.dialog.open(DialogAddMembersComponent, {
      panelClass: 'dialog-add-members',
      data: channelChat,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
