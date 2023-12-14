import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddMembersComponent } from '../dialog-add-members/dialog-add-members.component';
import { Chat } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-members',
  templateUrl: './dialog-members.component.html',
  styleUrls: ['./dialog-members.component.scss']
})
export class DialogMembersComponent implements OnInit {
  channelChat!: Chat;

  constructor(
    public dialogRef: MatDialogRef<DialogMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chat,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.channelChat = this.data; 
  }

  openAddMembersDialog(channelChat: Chat): void {
    const dialogRef = this.dialog.open(DialogAddMembersComponent, {
      panelClass: 'dialog-add-members',
      data: channelChat
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.openAddMembersDialog(this.channelChat);
  }
}