/*
  @description: Main Angular Routing File
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InjuryComponent } from './pages/injury/injury.component';
import { RegisterAccountComponent } from './pages/register-account/register-account.component';
import { PatientSurveyOneComponent } from './pages/patient-survey-one/patient-survey-one.component';
import { PatientSurveyTwoComponent } from './pages/patient-survey-two/patient-survey-two.component';
import { DocumentsSignComponent } from './pages/documents-sign/documents-sign.component';
import { LoginComponent } from './pages/login/login.component';
import { ClaimSuccessComponent } from './pages/claim-success/claim-success.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { HomeComponent } from './pages/home/home.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  // { path: '', component: HomeComponent },
  // { path: '', component: LoginComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterAccountComponent },
  { path: '', component: AppComponent },
  { path: 'claimsuccess', component: ClaimSuccessComponent, canActivate: [AuthGuardService]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [
    RouterModule

  ]
})
export class AppRoutingModule { }
