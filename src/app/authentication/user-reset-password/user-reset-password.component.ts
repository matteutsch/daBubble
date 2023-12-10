import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.scss']
})
export class UserResetPasswordComponent {

  hideNew: boolean = true;
  hideConfirm: boolean = true;

  resetPasswordForm = new FormGroup({
    passwordNewControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirmControl: new FormControl('', [Validators.required, Validators.minLength(6)])
  }, {
    validators: this.passwordMatchValidator
  });

  constructor(
    public auth: AuthService
  ) { }

  getErrorMessage() {
    const emailControl = this.resetPasswordForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('passwordNewControl');
    const confirmPassword = control.get('passwordConfirmControl');
    if (!password || !confirmPassword) {
      return null;
    }
    return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
  }

  resetPassword() {
    
  }
}
