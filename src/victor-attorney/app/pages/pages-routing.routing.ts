import { Router, Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { CasesComponent } from './cases/cases.component';
import { UpdateStatusComponent } from './update-status/update-status.component';
import { SettlementDetailsComponent } from './settlement-details/settlement-details.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { NonRepresentationComponent } from './non-representation/non-representation.component';
import { AttorneyInformationComponent } from './attorney-information/attorney-information.component';
import { AttorneyLoginAccountInfoComponent } from './attorney-login-account-info/attorney-login-account-info.component';

const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      {
        path: 'cases',
        component: CasesComponent
      },
      {
        path: 'update-status',
        component: UpdateStatusComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      {
        path: 'non-representation',
        component: NonRepresentationComponent
      },
      {
        path: 'attorney-information',
        component: AttorneyInformationComponent
      },
      {
        path: 'settlement-details',
        component: SettlementDetailsComponent
      },
      {
        path: 'login-account-info',
        component: AttorneyLoginAccountInfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
