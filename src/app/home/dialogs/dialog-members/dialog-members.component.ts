import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../dialog-create-channel/dialog-create-channel.component';
import { DialogAddMembersComponent } from '../dialog-add-members/dialog-add-members.component';

@Component({
  selector: 'app-dialog-members',
  templateUrl: './dialog-members.component.html',
  styleUrls: ['./dialog-members.component.scss']
})
export class DialogMembersComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog
  ) { }

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

  onNoClick(): void {
    this.dialogRef.close();
    this.openAddMembersDialog();
  }
}