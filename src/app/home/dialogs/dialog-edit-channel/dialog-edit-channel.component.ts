import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Chat, ChatData, User, UserData } from 'src/app/models/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-dialog-edit-channel',
  templateUrl: './dialog-edit-channel.component.html',
  styleUrls: ['./dialog-edit-channel.component.scss'],
})
export class DialogEditChannelComponent implements OnInit {
  @ViewChild('inputName') inputName!: ElementRef;
  @ViewChild('inputDescription') inputDescription!: ElementRef;
  @Output() dataChange = new EventEmitter<any>();

  channel: Chat = new ChatData();
  createdBy: User = new UserData();
  editChannelForm!: FormGroup;
  isChannelTitleEdited: boolean = false;
  isChannelDescriptionEdited: boolean = false;

  dataChangeSubject = new Subject<any>();
  dataChange$ = this.dataChangeSubject.asObservable();
  chatService: any;

  constructor(
    private firestoreService: FirestoreService,
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
    this.updateCreatedBy(this.channel.createdBy);
  }

  /**
   * Updates the 'createdBy' property by fetching user data from Firestore.
   *
   * @param {string} userID - The user ID to fetch data for.
   * @returns {Promise<void>} A Promise that resolves once user data is fetched and 'createdBy' is updated.
   */
  async updateCreatedBy(userID: string): Promise<void> {
    this.createdBy = await this.firestoreService.getDocumentFromCollection(
      'users',
      userID
    );
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

  /**
   * Toggles the edit mode for the channel name and focuses the input field for editing.
   *
   * @returns {void}
   */
  editChannelName(): void {
    this.isChannelTitleEdited = !this.isChannelTitleEdited;
    setTimeout(() => {
      if (this.inputName) {
        this.inputName.nativeElement.focus();
      }
    });
  }

  /**
   * Toggles the edit mode for the channel description and focuses the input field for editing.
   *
   * @returns {void}
   */
  editChannelDescription(): void {
    this.isChannelDescriptionEdited = !this.isChannelDescriptionEdited;
    setTimeout(() => {
      if (this.inputDescription) {
        this.inputDescription.nativeElement.focus();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  leaveChannel() {
    this.dialogRef.close('leave');
  }
}
