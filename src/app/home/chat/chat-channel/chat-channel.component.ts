import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddMembersComponent } from 'src/app/home/dialogs/dialog-add-members/dialog-add-members.component';
import { DialogEditChannelComponent } from 'src/app/home/dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogMembersComponent } from 'src/app/home/dialogs/dialog-members/dialog-members.component';
import { Chat } from 'src/app/models/models';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.scss']
})
export class ChatChannelComponent {

  @Input() drawerThread: any;
  @Input() channel!: Chat[];

  constructor(public dialog: MatDialog) { 
    setTimeout(()=> {
      console.log('channel:', this.channel);
      
    }, 1000)
  }

  

  openEditChannelDialog(): void {
    const dialogRef = this.dialog.open(DialogEditChannelComponent, {
      panelClass: 'dialog-edit-channel'
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  openMembersDialog(): void {
    const dialogRef = this.dialog.open(DialogMembersComponent, {
      panelClass: 'dialog-members'
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  openAddMembersDialog(): void {
    const dialogRef = this.dialog.open(DialogAddMembersComponent, {
      panelClass: 'dialog-add-members'
      // data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}