import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpHelperService } from '../../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../../services/monitor.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-attorney-login',
  templateUrl: './attorney-login.component.html',
  styleUrls: ['./attorney-login.component.scss']
})
export class AttorneyLoginComponent implements OnInit {
  public loginForm: FormGroup;
  public message: string;
  public showAlert: boolean;
  public loginStatus: boolean;
  public showLoader: boolean;

  get loginFormControls() {
    return this.loginForm.controls;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpHelper: HttpHelperService,
    private monitorService: MyMonitoringService,
    private authentication: AuthenticationService
  ) {
    this.loginForm = this.fb.group({
      EmailId: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  // To save, monitoring  Login details
  monitoringData(value: string): any {
    this.monitorService.logEvent('ATTORNEY-LOGIN_' + value);
  }

  checkUserAvailability(): void {
    const requestData = {
      data: {
        EmailId: this.loginForm.value.EmailId
      }
    };

    this.httpHelper.httpPost('/api/fn-uservalidate', requestData, {}, true).subscribe((res: any) => {
      if (res.status === 'SUCCESS') {
        console.log(res);
      }
    });
  }

  login(): void {
    this.monitoringData('LOGGING_IN');
    this.showAlert = false;
    this.showLoader = true;

    const requestData = {
      data: this.loginForm.value
    };

    this.httpHelper.httpPost('/api/fn-attorneylogin', requestData, {}, true).subscribe((res: any) => {
      this.showLoader = false;
      if (res.status === 'SUCCESS') {
        this.onLoginSuccess(res);
      } else {
        this.onLoginFailure(res);
      }
    });
  }

  onLoginSuccess(response: any): void {
    this.showAlert = true;
    this.loginStatus = true;
    this.authentication.setUserID(this.loginFormControls.EmailId.value);
    this.authentication.setEmail(this.loginFormControls.EmailId.value);
    this.monitorService.setAuthentication(this.loginFormControls.EmailId.value, '', true);
    this.message = 'Logged in successfully.Please wait...';

    timer(2000).subscribe(() => {
      window.location.href = '/attorney/';
    });

  }

  onLoginFailure(response: any): void {
    this.showAlert = true;
    this.loginStatus = false;
    this.monitoringData('FAILED');
    this.message = response.message || 'Unexpected error occured';
  }

  navigate(pageName: string, e) {
    e.preventDefault();
    this.router.navigate([pageName]);
  }

}
