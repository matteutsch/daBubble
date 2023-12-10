import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../services/auth.service';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';
import { UserSendEmailComponent } from './user-send-email/user-send-email.component';

@NgModule({
  providers: [AuthService],
  declarations: [
    SignUpComponent,
    SignInComponent,
    UserResetPasswordComponent,
    UserSendEmailComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
  ],
})
export class AuthenticationModule {}
