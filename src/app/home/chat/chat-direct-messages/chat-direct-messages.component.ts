import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from 'src/app/home/shared/chat.service';
import { DialogEditChannelComponent } from 'src/app/home/dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogMemberProfileComponent } from '../../dialogs/dialog-member-profile/dialog-member-profile.component';
import { SelectService } from '../../shared/select.service';
import { User } from 'src/app/models/models';

@Component({
  selector: 'app-chat-direct-messages',
  templateUrl: './chat-direct-messages.component.html',
  styleUrls: ['./chat-direct-messages.component.scss'],
})
export class ChatDirectMessagesComponent implements OnChanges {
  @Input() selectedUser!: User;
  @ViewChild('') chatTextArea!: ElementRef;

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    private select: SelectService
  ) {}

  ngOnChanges() {
    this.select.selectedUser$.subscribe((selectedUser) => {
      this.selectedUser = selectedUser;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogEditChannelComponent, {
      panelClass: 'dialog-edit-channel',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openUserProfile() {
    const dialogRef = this.dialog.open(DialogMemberProfileComponent, {
      panelClass: 'dialog-member-profile',
      data: {
        chatTextArea: this.chatTextArea,
      },
    });
  }
}
