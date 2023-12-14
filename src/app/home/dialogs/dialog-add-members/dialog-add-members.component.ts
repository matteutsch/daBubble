import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Chat } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-add-members',
  templateUrl: './dialog-add-members.component.html',
  styleUrls: ['./dialog-add-members.component.scss'],
})
export class DialogAddMembersComponent implements OnInit {
  channelChat!: Chat;

  constructor(
    public dialogRef: MatDialogRef<DialogAddMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chat
  ) {}

  ngOnInit(): void {
    this.channelChat = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
