import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-send-email',
  templateUrl: './user-send-email.component.html',
  styleUrls: ['./user-send-email.component.scss']
})
export class UserSendEmailComponent {

  sendEmailForm = new FormGroup({
    emailControl: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    public auth: AuthService
    ) { }

  getErrorMessage() {
    const emailControl = this.sendEmailForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }

  sendEmail() {
    const email = this.sendEmailForm.value.emailControl as string;
    if (email) {
      // this.auth.SignUp(email, password, name, this.pickedAvatarUrl);
    }
  }
}
