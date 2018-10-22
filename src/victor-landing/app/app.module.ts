import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from '../../shared/shared.module';
import { HttpHelperService } from '../../services/http-helper.service';
import { ValidationService } from '../../services/validation.service';
import { MyMonitoringService } from '../../services/monitor.service';
import { UserIdleService } from '../../services/user-idle.service';
import { DialogServiceService } from '../../services/dialog-service.service';
import { SessionService } from '../../services/session.service';
import { AuthenticationService } from '../../services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PagesModule } from './pages/pages.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    PagesModule,
    AppRoutingModule
  ],
  providers: [HttpHelperService, ValidationService, MyMonitoringService,
    UserIdleService, DialogServiceService, SessionService, CookieService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
