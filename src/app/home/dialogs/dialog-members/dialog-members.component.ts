import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogAddMembersComponent } from '../dialog-add-members/dialog-add-members.component';
import { Chat, User } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-members',
  templateUrl: './dialog-members.component.html',
  styleUrls: ['./dialog-members.component.scss'],
})
export class DialogMembersComponent implements OnInit {
  channelMember: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User[],
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.channelMember = this.data;
  }

  openAddMembersDialog(): void {
    const dialogRef = this.dialog.open(DialogAddMembersComponent, {
      panelClass: 'dialog-add-members',
      data: this.channelMember,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  close(): void {
    this.dialogRef.close();
    this.openAddMembersDialog();
  }
}
