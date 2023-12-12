import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ImpressumComponent } from './impressum/impressum.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';
import { UserSendEmailComponent } from './user-send-email/user-send-email.component';
import { DataPolicyComponent } from './data-policy/data-policy.component';

@NgModule({
  providers: [AuthService],
  declarations: [
    SignUpComponent,
    SignInComponent,
    UserResetPasswordComponent,
    UserSendEmailComponent,
    ImpressumComponent,
    DataPolicyComponent,
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
