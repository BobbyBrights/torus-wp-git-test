import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { HttpHelperService } from '../../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../../services/monitor.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-attorney-reset-password',
  templateUrl: './attorney-reset-password.component.html',
  styleUrls: ['./attorney-reset-password.component.scss']
})

export class AttorneyResetPasswordComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public showLoader: boolean;
  public code = '';
  public message: string;
  public showAlert: boolean;

  constructor(public router: Router,
    private fb: FormBuilder,
    private httpHelper: HttpHelperService,
    private monitorService: MyMonitoringService,
    private authentication: AuthenticationService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      NewPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)]],
      ConfirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)]]
    }, {
        validator: this.MatchPasswords // your validation method
      });

    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.code = param.code;
    });
  }

  // To save, monitoring  Login details
  monitoringData(value: string): any {
    this.monitorService.logEvent('ATTORNEY-RESET_PASSWORD_' + value);
  }

  get resetPasswordControls(): any {
    return this.resetPasswordForm.controls;
  }

  MatchPasswords(AC: AbstractControl) {
    const password = AC.get('NewPassword').value; // to get value in input tag
    const confirmPassword = AC.get('ConfirmPassword').value; // to get value in input tag
    if (password !== confirmPassword) {
      console.log('false');
      AC.get('ConfirmPassword').setErrors({ MatchPassword: true });
    } else {
      // AC.get('ConfirmPassword').setErrors({ MatchPassword: false, required: null });
      // if (password && confirmPassword) {
      //   AC.get('ConfirmPassword').setErrors(null);
      // }
      return null;
    }
  }

  resetPassword() {
    this.monitoringData('RESET_PASSWORD');
    this.showLoader = true;

    const requestData = {
      data: {
        HashKey: this.code,
        Password: this.resetPasswordForm.value.ConfirmPassword
      }
    };
    this.httpHelper.httpPost('/api/fn-resetpassword', requestData, {}, true).subscribe((res: any) => {
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
    this.message = response.message || 'Your password has been changed successfully.Please wait...';
    timer(2000).subscribe(() => {
      this.router.navigate(['pages/attorney-login']);
    });
  }

  onResultFailure(response: any): void {
    this.showAlert = true;
    this.message = response.message || 'An unexpected error has occured';
  }

}
