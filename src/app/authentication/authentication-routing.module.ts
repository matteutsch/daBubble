import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataPolicyComponent } from './data-policy/data-policy.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'data-policy', component: DataPolicyComponent },
  { path: 'impressum', component: ImpressumComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
