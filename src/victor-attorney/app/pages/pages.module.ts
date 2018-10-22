import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PagesRoutingModule } from "./pages-routing.routing";

import { PagesComponent } from "./pages.component";
import { CasesComponent } from "./cases/cases.component";
import { UpdateStatusComponent } from "./update-status/update-status.component";
import { SettlementDetailsComponent } from "./settlement-details/settlement-details.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { NonRepresentationComponent } from "./non-representation/non-representation.component";
import { AttorneyInformationComponent } from "./attorney-information/attorney-information.component";
import {AttorneyLoginAccountInfoComponent} from './attorney-login-account-info/attorney-login-account-info.component'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    PagesComponent,
    CasesComponent,
    UpdateStatusComponent,
    SettlementDetailsComponent,
    ContactUsComponent,
    NonRepresentationComponent,
    AttorneyInformationComponent,
    AttorneyLoginAccountInfoComponent
  ]
})
export class PagesModule {}
