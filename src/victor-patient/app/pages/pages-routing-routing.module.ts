import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { InjuryComponent } from './injury/injury.component';
import { AuthGuardService } from '../guards/auth-guard.service';
import { PatientSurveyOneComponent } from './patient-survey-one/patient-survey-one.component';
import { PatientSurveyTwoComponent } from './patient-survey-two/patient-survey-two.component';
import { DocumentsSignComponent } from './documents-sign/documents-sign.component';

const routes: Routes = [{
  path: 'pages',
  component: PagesComponent,
  children: [
    { path: 'injury', component: InjuryComponent },
    { path: 'patient-survey-one', component: PatientSurveyOneComponent },
    { path: 'patient-survey-two', component: PatientSurveyTwoComponent },
    { path: 'documentssign', component: DocumentsSignComponent },
  ],
  canActivateChild: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingRoutingModule { }
