import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  editForm!: FormGroup;

  isOpen: boolean = false;
  isCheckingProfile: boolean = false;
  isEditing: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  //TODO: variable for controls
  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      nameControl: new FormControl('Frederik Beck', [Validators.required]),
      mailControl: new FormControl('fred.beck@email.com', [
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

  submit() {
    console.log('save');
  }
}
