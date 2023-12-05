import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddMembersComponent } from 'src/app/shared/dialog-add-members/dialog-add-members.component';
import { DialogEditChannelComponent } from 'src/app/shared/dialog-edit-channel/dialog-edit-channel.component';
import { DialogMembersComponent } from 'src/app/shared/dialog-members/dialog-members.component';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.scss']
})
export class ChatChannelComponent {

  @Input() drawerThread: any;

  constructor(public dialog: MatDialog) { }

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