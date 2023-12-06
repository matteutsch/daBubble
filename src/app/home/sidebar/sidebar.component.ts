import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from '../dialogs/dialog-create-channel/dialog-create-channel.component';
import { ChatService } from 'src/app/home/shared/chat.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  showChannels: boolean = true;
  showDirectMessages: boolean = true;
  @Input() isMainChatChannel: any;

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService
    ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateChannelComponent, {
      panelClass: 'dialog-create-channel'
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
