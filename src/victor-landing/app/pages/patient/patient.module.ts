import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientLoginComponent } from './patient-login/patient-login.component';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    PatientLoginComponent,
    PatientRegisterComponent
  ],
  exports: [
    PatientLoginComponent,
    PatientRegisterComponent
  ]
})
export class PatientModule { }
