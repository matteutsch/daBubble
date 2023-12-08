import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  hide: boolean = true;

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  constructor(public auth: AuthService) { }

  getErrorMessage() {
    const emailControl = this.signinForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'You must enter a value';
    }

    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }

  signIn() {
    const email = this.signinForm.value.email as string;
    const password = this.signinForm.value.password as string;

    if (email && password) {
      this.auth.SignIn(email, password);
    }
  }
}
