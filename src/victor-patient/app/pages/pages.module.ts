import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { InjuryComponent } from './injury/injury.component';
import { DocumentsSignComponent } from './documents-sign/documents-sign.component';
import { PatientSurveyOneComponent } from './patient-survey-one/patient-survey-one.component';
import { PatientSurveyTwoComponent } from './patient-survey-two/patient-survey-two.component';
import { PagesComponent } from './pages.component';
import { PagesRoutingRoutingModule } from './pages-routing-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PagesRoutingRoutingModule
  ],
  declarations: [
    PagesComponent,
    InjuryComponent,
    DocumentsSignComponent,
    PatientSurveyOneComponent,
    PatientSurveyTwoComponent,
  ],
})
export class PagesModule { }
