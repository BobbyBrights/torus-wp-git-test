// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing.module';

// Components
import { AppComponent } from './app.component';
import { RegisterAccountComponent } from './pages/register-account/register-account.component';
import { LoginComponent } from './pages/login/login.component';
import { ClaimSuccessComponent } from './pages/claim-success/claim-success.component';


// Services
import { HttpHelperService } from '../../services/http-helper.service';
import { ValidationService } from '../../services/validation.service';
import { MyMonitoringService } from '../../services/monitor.service';
import { UserIdleService } from '../../services/user-idle.service';
import { DialogServiceService } from '../../services/dialog-service.service';
import { SessionService } from '../../services/session.service';
import { AuthGuardService } from './guards/auth-guard.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../../services/authentication.service';
import { HomeComponent } from './pages/home/home.component';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from '../../shared/shared.module';
//import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterAccountComponent,
    LoginComponent,
    ClaimSuccessComponent,
    HomeComponent,
   // ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    PagesModule,
    AppRoutingModule
  ],
  providers: [HttpHelperService, ValidationService, MyMonitoringService,
    UserIdleService, DialogServiceService, SessionService, AuthGuardService, CookieService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
