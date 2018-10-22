import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpHelperService } from '../../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../../services/monitor.service';
import { AuthenticationService } from '../../../../../services/authentication.service';

@Component({
  selector: 'app-attorney-forgot-password',
  templateUrl: './attorney-forgot-password.component.html',
  styleUrls: ['./attorney-forgot-password.component.scss']
})
export class AttorneyForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;
  public showLoader: boolean;
  public message: string;
  public showAlert: boolean;

  constructor(public router: Router,
    private fb: FormBuilder,
    private httpHelper: HttpHelperService,
    private monitorService: MyMonitoringService,
    private authentication: AuthenticationService) { }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]]
    });
  }

  // To save, monitoring  Login details
  monitoringData(value: string): any {
    this.monitorService.logEvent('ATTORNEY-FORGOT_PASSWORD_' + value);
  }

  get forgotPasswordControls(): any {
    return this.forgotPasswordForm.controls;
  }

  navigate(event) {
    event.preventDefault();
    this.router.navigate(['pages/attorney-login']);
  }

  forgotPassword() {
    this.monitoringData('FORGOT_PASSWORD');
    this.showLoader = true;

    const requestData = {
      data: {
        EmailId: this.forgotPasswordForm.value.Email,
        NextPage: `${window.location.origin}/pages/attorney-reset-password`
      }
    };
    this.httpHelper.httpPost('/api/fn-emailtoresetpassword', requestData, {}, true).subscribe((res: any) => {
      this.showLoader = false;
      if (res.status === 'SUCCESS') {
        this.onResultSuccess(res);
      } else {
        this.onResultFailure(res);
      }
    });
  }

  onResultSuccess(response: any): void {
    this.showAlert = true;
    this.message = response.message || 'An email has been sent to your inbox with the link to reset your password';
  }

  onResultFailure(response: any): void {
    this.showAlert = true;
    this.message = response.message || 'An unexpected error has occured';
  }

}
