import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss'],
})
export class DialogEditProfileComponent implements OnInit {
  @ViewChild('inputName') inputName!: ElementRef;

  user!: User;
  editForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogEditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {}

  ngOnInit() {
    this.user = this.data.user;

    this.editForm = this.fb.group({
      nameControl: new FormControl({ value: this.user.name, disabled: false }, [
        Validators.required,
      ]),
      mailControl: new FormControl({ value: this.user.email, disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
      fileControl: new FormControl(
        { value: this.user.photoURL, disabled: false },
        [Validators.required]
      ),
    });
  }

  submit() {
    this.dialogRef.close(this.editForm.value);
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * Toggles the edit mode for the user profile and focuses the input field for editing the name.
   * 
   * @returns {void}
   */
  toggleEditProfile(): void {
    this.isEditing = !this.isEditing;
    setTimeout(() => {
      if (this.inputName) {
        this.inputName.nativeElement.focus();
      }
    });
  }

  /**
   * Handles the user selecting a file.
   * @param {any} event - The event object for the file selection.
   * @returns {void}
   */
  onFileSelected(event: any): void {
    this.userService.uploadFile(event.target.files[0], this.editForm);
  }
}
