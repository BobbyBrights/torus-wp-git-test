import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientModule } from './patient/patient.module';
import { SharedModule } from '../../../shared/shared.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.routing';
import { AttorneyModule } from './attorney/attorney.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PatientModule,
    AttorneyModule,
    PagesRoutingModule
  ],
  declarations: [PagesComponent]
})
export class PagesModule { }
