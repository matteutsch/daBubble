import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Chat } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-edit-channel',
  templateUrl: './dialog-edit-channel.component.html',
  styleUrls: ['./dialog-edit-channel.component.scss'],
})
export class DialogEditChannelComponent implements OnInit {
  @Output() dataChange = new EventEmitter<any>();

  channel!: Chat;
  editChannelForm!: FormGroup;
  isChannelTitleEdited: boolean = false;
  isChannelDescriptionEdited: boolean = false;

  dataChangeSubject = new Subject<any>();
  dataChange$ = this.dataChangeSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogEditChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chat
  ) {}

  ngOnInit(): void {
    this.channel = this.data;

    this.editChannelForm = this.fb.group({
      nameControl: new FormControl(this.channel.name),
      descriptionControl: new FormControl(this.channel.description),
    });
  }
  updateValues() {
    this.dataChangeSubject.next(this.editChannelForm.value);
    this.dataChange$.subscribe((e) => {
      this.editChannelForm.setValue({
        nameControl: e.nameControl,
        descriptionControl: e.descriptionControl,
      });
    });
  }
  submit() {
    this.updateValues();
    this.dataChange.emit(this.editChannelForm.value);
  }
  editChannelName() {
    this.isChannelTitleEdited = !this.isChannelTitleEdited;
  }
  editChannelDescription() {
    this.isChannelDescriptionEdited = !this.isChannelDescriptionEdited;
  }
  close(): void {
    this.dialogRef.close();
  }
  leaveChannel() {
    this.dialogRef.close('leave');
  }
}
