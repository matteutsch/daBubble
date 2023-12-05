import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SendEmailComponent } from './send-email/send-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { AccountCreatingComponent } from './account-creating/account-creating.component';

@NgModule({
  declarations: [
    SendEmailComponent,
    ResetPasswordComponent,
    LoginComponent,
    ChooseAvatarComponent,
    AccountCreatingComponent,
  ],
  imports: [CommonModule, AuthenticationRoutingModule],
})
export class AuthenticationModule {}
