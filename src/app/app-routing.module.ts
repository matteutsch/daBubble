import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './home/content/content.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { UserResetPasswordComponent } from './authentication/user-reset-password/user-reset-password.component';
import { UserSendEmailComponent } from './authentication/user-send-email/user-send-email.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  { path: 'home/:id', component: ContentComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'send-email', component: UserSendEmailComponent },
  { path: 'reset-password', component: UserResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
