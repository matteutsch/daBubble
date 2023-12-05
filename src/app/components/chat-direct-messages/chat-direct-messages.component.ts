import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from 'src/app/services/chat.service';
import { DialogEditChannelComponent } from 'src/app/shared/dialog-edit-channel/dialog-edit-channel.component';

@Component({
  selector: 'app-chat-direct-messages',
  templateUrl: './chat-direct-messages.component.html',
  styleUrls: ['./chat-direct-messages.component.scss']
})
export class ChatDirectMessagesComponent {

  chatMessages: any = [];

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService
    ) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogEditChannelComponent, {
      panelClass: 'dialog-edit-channel'
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
