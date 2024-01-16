import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  isChecked: boolean = false;
  hide = true;
  showAvatarSection: boolean = false;

  signupForm = new FormGroup({
    nameControl: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    passwordControl: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    fileControl: new FormControl('', [Validators.required]),
  });

  avatar_list: string[] = [
    'assets/characters/character_1.png',
    'assets/characters/character_2.png',
    'assets/characters/character_3.png',
    'assets/characters/character_4.png',
    'assets/characters/character_5.png',
    'assets/characters/character_6.png',
  ];

  constructor(public auth: AuthService, public userService: UserService) {}

  toggleCheck() {
    this.isChecked = !this.isChecked;
  }

  getErrorMessage() {
    const emailControl = this.signupForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }

  signUp() {
    const email = this.signupForm.value.emailControl as string;
    const password = this.signupForm.value.passwordControl as string;
    const name = this.signupForm.value.nameControl as string;
    const photoURL = this.signupForm.value.fileControl as string;
    if (email && password) {
      this.auth.SignUp(email, password, name, photoURL);
    }
  }

  toggleFormSection(): void {
    this.showAvatarSection = !this.showAvatarSection;
  }

  /**
   * Handles the user selecting a file.
   * @param {any} event - The event object for the file selection.
   * @returns {void}
   */
  onFileSelected(event: any): void {
    this.userService.uploadFile(event.target.files[0], this.signupForm);
  }
}
