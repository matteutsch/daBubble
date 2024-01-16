import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-channel',
  templateUrl: './dialog-create-channel.component.html',
  styleUrls: ['./dialog-create-channel.component.scss'],
})
export class DialogCreateChannelComponent implements OnInit {
  channelForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCreateChannelComponent>
  ) {}

  ngOnInit() {
    this.channelForm = this.fb.group({
      nameControl: new FormControl('', Validators.required),
      descriptionControl: new FormControl(''),
    });
  }

  submit() {
    this.dialogRef.close(this.channelForm.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
