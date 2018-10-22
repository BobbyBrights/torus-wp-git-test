import { Router, Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { PatientLoginComponent } from './patient/patient-login/patient-login.component';
import { PatientRegisterComponent } from './patient/patient-register/patient-register.component';
import { AttorneyLoginComponent } from './attorney/attorney-login/attorney-login.component';
import { AttorneyRegisterComponent } from './attorney/attorney-register/attorney-register.component';
import { AttorneyForgotPasswordComponent } from './attorney/attorney-forgot-password/attorney-forgot-password.component';
import { ContactUsComponent } from './attorney/contact-us/contact-us.component';
import { AttorneyResetPasswordComponent } from './attorney/attorney-reset-password/attorney-reset-password.component';

const routes: Routes = [{
  path: 'pages',
  component: PagesComponent,
  children: [{
    path: 'patient-login',
    component: PatientLoginComponent
  }, {
    path: 'patient-register',
    component: PatientRegisterComponent
  },
  {
    path: 'attorney-login',
    component: AttorneyLoginComponent
  }, {
    path: 'attorney-register',
    component: AttorneyRegisterComponent
  }, {
    path: 'attorney-forgot-password',
    component: AttorneyForgotPasswordComponent
  }, {
    path: 'contact-us',
    component: ContactUsComponent
  }, {
    path: 'attorney-reset-password',
    component: AttorneyResetPasswordComponent
  }]

}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})

export class PagesRoutingModule { }
