import { Component, Input, OnChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnChanges {
  editForm!: FormGroup;
  isOpen: boolean = false;
  isCheckingProfile: boolean = false;
  isEditing: boolean = false;

  @Input() user!: User;

  constructor(private formBuilder: FormBuilder, public auth: AuthService) {}

  ngOnChanges(): void {
    this.editForm = this.formBuilder.group({
      nameControl: new FormControl(this.user.name, [Validators.required]),
      mailControl: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  toggleLogout() {
    this.isOpen = !this.isOpen;
    if (this.isCheckingProfile) {
      this.toggleCheckProfile();
    } else if (this.isEditing) {
      this.toggleEditProfile();
    }
  }
  toggleCheckProfile() {
    this.isCheckingProfile = !this.isCheckingProfile;
    if (this.isEditing) {
      this.toggleEditProfile();
    }
  }

  toggleEditProfile() {
    this.isEditing = !this.isEditing;
  }

  logout() {
    this.auth.SignOut();
  }

  submit() {
    console.log('save');
  }
}
