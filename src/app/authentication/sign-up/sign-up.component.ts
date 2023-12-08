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
    name: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });
  
  avatar_list: string[] = [
    'assets/characters/character_1.png',
    'assets/characters/character_2.png',
    'assets/characters/character_3.png',
    'assets/characters/character_4.png',
    'assets/characters/character_5.png',
    'assets/characters/character_6.png',
  ];
  pickedAvatarUrl: string = 'assets/characters/default_character.png';
  isButtonDisabled: boolean = true;

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
    const email = this.signupForm.value.email as string;
    const password = this.signupForm.value.password as string;
    const name = this.signupForm.value.name as string;
    console.log('email:', email);
    console.log('password:', password);
    console.log('name:', name);

    if (email && password) {
      this.auth.SignUp(email, password, name, this.pickedAvatarUrl);
    }
  }

  toggleFormSection(): void {
    this.showAvatarSection = !this.showAvatarSection;
  }

  chooseAvatar(pickedImg: string) {
    this.pickedAvatarUrl = pickedImg;
    this.isButtonDisabled = false;
  }
}
