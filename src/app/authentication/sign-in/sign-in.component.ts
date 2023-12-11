import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  hide: boolean = true;

  signinForm = new FormGroup({
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    passwordControl: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(public auth: AuthService) {}

  getErrorMessage() {
    const emailControl = this.signinForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }

  signIn() {
    const email = this.signinForm.value.emailControl as string;
    const password = this.signinForm.value.passwordControl as string;

    if (email && password) {
      this.auth.SignIn(email, password);
    }
  }
}
