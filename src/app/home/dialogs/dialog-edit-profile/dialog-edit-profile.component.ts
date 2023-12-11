import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss'],
})
export class DialogEditProfileComponent implements OnInit {
  user!: User;
  editForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogEditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {}

  ngOnInit() {
    this.user = this.data.user;

    this.editForm = this.fb.group({
      nameControl: new FormControl(this.user.name, [Validators.required]),
      mailControl: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  submit() {
    console.log('save user');
    this.dialogRef.close(this.editForm.value);
  }

  close() {
    this.dialogRef.close();
  }

  toggleEditProfile() {
    this.isEditing = !this.isEditing;
  }
}
