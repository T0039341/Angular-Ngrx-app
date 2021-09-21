import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../user/login/login.component';
import { MainComponent } from '../main/main.component';
import { AddEditComponent } from '../tanks/add-edit-tank/add-edit-tank.component';
import { RegisterComponent } from '../user/register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { TanksComponent } from '../tanks/tanks.component';
import { TankDetailsComponent } from '../tanks/tank-details/tank-details.component';
import { ReportComponent } from '../tanks/report/report.component';
import { EditUserComponent } from '../user/edit-user/edit-user.component';
import { PasswordResetComponent } from '../user/password-reset/password-reset.component';
import { TankVerificationComponent } from '../tank-verification/tank-verification.component';
import { TankVerificationDeactivateGuard } from '../tank-verification/tank-verification-deactivate-guard';
import { SupportComponent } from '../support/support.component';
import { PrivacyPolicyComponent } from 'src/privacy-policy/privacy-policy.component';
import { UpdatePasswordComponent } from '../update-password/update-password.component';
// import { EditTankComponent } from '../tanks/edit-tank/edit-tank.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'support',
    component: SupportComponent
  },

  { path: 'login', component: LoginComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  {
    path: 'users/:id/password-reset',
    component: UpdatePasswordComponent
  },
  {
    path: 'main',
    canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      { path: 'tanks/add', component: AddEditComponent },

      {
        path: 'tanks',
        component: TanksComponent
      },
      {
        path: 'tanks/:id',
        component: TankDetailsComponent
      },
      {
        path: 'tanks/:id/edit',
        component: AddEditComponent
      },
      {
        path: 'tanks/:id/reports',
        component: ReportComponent
      },
      {
        path: 'settings',
        component: EditUserComponent
      },
      {
        path: 'tanks/:id/verify',
        component: TankVerificationComponent,
        canDeactivate: [TankVerificationDeactivateGuard]
      }
    ]
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
