import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  hide = true;
  showAvatarSection: boolean = false;

  signupForm = new FormGroup({
    nameControl: new FormControl('', [Validators.required, Validators.minLength(3)]),
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    passwordControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fileControl: new FormControl('', [Validators.required])
  });

  avatar_list: string[] = [
    'assets/characters/character_1.png',
    'assets/characters/character_2.png',
    'assets/characters/character_3.png',
    'assets/characters/character_4.png',
    'assets/characters/character_5.png',
    'assets/characters/character_6.png',
  ];

  constructor(
    public auth: AuthService
  ) { }

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

  chooseAvatar(pickedImg: string) {
    this.signupForm.get('fileControl')?.setValue(pickedImg ? pickedImg : '');
  }

  onFileChange($event: any) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.signupForm.get('fileControl')?.setValue(file ? file.name : ''); // <-- Set Value for Validation
    console.log('file.name:', file.name);
  }
}
