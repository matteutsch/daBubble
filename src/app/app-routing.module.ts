import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { UserResetPasswordComponent } from './authentication/user-reset-password/user-reset-password.component';
import { UserSendEmailComponent } from './authentication/user-send-email/user-send-email.component';
import { DataPolicyComponent } from './data-policy/data-policy.component';
import { ImpressumComponent } from './impressum/impressum.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'send-email', component: UserSendEmailComponent },
  { path: 'reset-password', component: UserResetPasswordComponent },
  { path: 'data-policy', component: DataPolicyComponent },
  { path: 'impressum', component: ImpressumComponent },
  {
    path: 'home/:id',
    loadChildren: () => import('./home/home.module'),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
