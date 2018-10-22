/* ---------------------------------------------------------------------------
    UI Framework    : Angular
    Version         : 5.0
    Build ID        : 0
    Modified By     : Admin
    Modified Date   : 2018-Sep-22 10:30 AM
    Component Name  : Login Screen

  --------------------------------------------------------------------------- */

// Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdleService } from '../../../../../services/user-idle.service';
import { HttpHelperService } from '../../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../../services/monitor.service';
import { SessionService } from '../../../../../services/session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timer } from 'rxjs/observable/timer';
import { AuthenticationService } from '../../../../../services/authentication.service';

declare var $: any;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

// Component Definition
@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.scss']
})
export class PatientLoginComponent implements OnInit {

  // Variable Declaration
  public loginData: any = {};
  public showTimer = false;
  public userTypes: Array<string> = ['Patient', 'Hospital', 'Attorney', 'Admin'];
  public selectedUserType = '';
  public regStatus = false;
  public showAlert = false;
  public message = '';
  public showLoader = false;

  constructor(
    public router: Router,
    private http: HttpHelperService, private userIdle: UserIdleService,
    private myMonitoringService: MyMonitoringService,
    private sessionService: SessionService,
    private authentication: AuthenticationService) { }


  // To handle initialization of ng load
  ngOnInit() {
    this.myMonitoringService.logPageView('LOGIN_INPROGRESS', '/Login');
  }

  // To Unsubscribe
  ngOnDestroy(): void {
    this.myMonitoringService.logPageView('LOGIN_LEFT', '/Login');
  }

  // To save, monitoring  Login details
  monitoringData(getVal): any {
    this.myMonitoringService.logEvent('LOGIN_' + getVal);
  }

  // To navigate screen
  navigate(clickedfrom, e?: any) {
    if (e) {
      e.preventDefault();
    }
    if (clickedfrom === 'Patient') {
      this.selectedUserType = clickedfrom;
      this.sessionService.setSessionVar('userType', clickedfrom.toLowerCase());
    } else if (clickedfrom === 'NewUser') {
      this.monitoringData('NEW-USER_CLICKED');
      this.router.navigate(['pages/patient-register']);
    } else if (clickedfrom === 'ForgetId') {
      this.monitoringData('FORGOT-PASSWORD_CLICKED');
      $('#ForgotPwdModal').modal({ show: true });
    }
  }

  // To login
  login() {
    this.monitoringData('LOGGING_IN');
    this.showAlert = false;
    const requestData: any = {
      data: this.loginData
    };
    this.showLoader = true;
    this.http.httpPost('/api/fn-login', requestData, httpOptions).subscribe((res: any) => {
      //  $('#LoginAlert').alert();
      this.showLoader = false;
      if (res.status === 'SUCCESS') {
        this.onLoginSuccess(res);
      } else {
        this.onLoginFailure(res);
      }
    });
  }

  /*
  When login got success the user will see an alert message and navigates to the screen where he/she left previously
  @var: response.screen_name is the last screen name he worked
  */
  onLoginSuccess(response: any): void {
    this.showAlert = true;
    this.regStatus = true;
    this.monitoringData('COMPLETED');
    this.authentication.setUserID(this.loginData.UserName);
    this.authentication.setEmail(response.data.email);
    this.sessionService.setSessionVar('lastPage', response.data.screen_name);
    this.myMonitoringService.setAuthentication(this.loginData.UserName, '', true);
    this.message = 'Logged in successfully.Please wait...';
    timer(2000).subscribe(() => {
      if (response.data.screen_name && response.data.screen_name !== '') {
        const routePage = this.sessionService.getSessionVar('pages')[response.data.screen_name];
        this.router.navigate([routePage]);
        window.location.href = '/patient';
      } else {
        this.router.navigate(['pages/patient-survey-one']);
        window.location.href = '/patient';
      }
    });
  }

  /*
  When the user login failed, an alert message appears
  */
  onLoginFailure(response: any): void {
    this.showAlert = true;
    this.regStatus = false;
    this.monitoringData('FAILED');
    this.message = response.message || 'Unexpected error occured';
  }

}
