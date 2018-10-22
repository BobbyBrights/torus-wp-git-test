import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttorneyLoginComponent } from './attorney-login/attorney-login.component';
import { AttorneyRegisterComponent } from './attorney-register/attorney-register.component';
import { AttorneyForgotPasswordComponent } from './attorney-forgot-password/attorney-forgot-password.component';
import { AttorneyResetPasswordComponent } from './attorney-reset-password/attorney-reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [AttorneyLoginComponent, AttorneyRegisterComponent,
    AttorneyForgotPasswordComponent, AttorneyResetPasswordComponent, ContactUsComponent],
  exports: [AttorneyLoginComponent, AttorneyRegisterComponent,
     AttorneyForgotPasswordComponent, AttorneyResetPasswordComponent, ContactUsComponent]
})
export class AttorneyModule { }
