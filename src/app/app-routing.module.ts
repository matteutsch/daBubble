import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { UserResetPasswordComponent } from './authentication/user-reset-password/user-reset-password.component';
import { UserSendEmailComponent } from './authentication/user-send-email/user-send-email.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  { path: 'send-email', component: UserSendEmailComponent },
  { path: 'reset-password', component: UserResetPasswordComponent },
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
export class AppRoutingModule {}
