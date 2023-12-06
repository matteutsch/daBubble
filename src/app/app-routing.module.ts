import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountCreatingComponent } from './authentication/account-creating/account-creating.component';
import { ChooseAvatarComponent } from './authentication/choose-avatar/choose-avatar.component';
import { LoginComponent } from './authentication/login/login.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { SendEmailComponent } from './authentication/send-email/send-email.component';
import { ContentComponent } from './home/content/content.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: ContentComponent },
  { path: 'register', component: AccountCreatingComponent },
  { path: 'choose-avatar', component: ChooseAvatarComponent },
  { path: 'send-email', component: SendEmailComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
