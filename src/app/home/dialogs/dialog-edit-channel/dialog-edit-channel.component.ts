import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../dialog-create-channel/dialog-create-channel.component';
import { Chat } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-edit-channel',
  templateUrl: './dialog-edit-channel.component.html',
  styleUrls: ['./dialog-edit-channel.component.scss'],
})
export class DialogEditChannelComponent implements OnInit {
  channelChat!: Chat;
  isChannelTitleEdited: boolean = false;
  isChannelDescriptionEdited: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chat
  ) {}

  ngOnInit(): void {
    this.channelChat = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editChannelName() {
    this.isChannelTitleEdited = !this.isChannelTitleEdited;
  }

  editChannelDescription() {
    this.isChannelDescriptionEdited = !this.isChannelDescriptionEdited;
  }
}
