import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpHelperService } from '../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../services/monitor.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { ValidationService } from '../../../../services/validation.service';

@Component({
  selector: 'app-attorney-information',
  templateUrl: './attorney-information.component.html',
  styleUrls: ['./attorney-information.component.scss']
})
export class AttorneyInformationComponent implements OnInit {
  public attorneyInformationForm: FormGroup;
  public showLoader: boolean;
  public states: Array<any> = [];
  public cities: Array<any> = [];
  public attorneys: Array<any> = [];
  public lawFirms: Array<any> = [];
  sessionService: any;
  cookieService: any;

  constructor(
    public router: Router,
    public validation: ValidationService,
    private fb: FormBuilder,
    private httpHelper: HttpHelperService,
    private monitorService: MyMonitoringService,
    private authentication: AuthenticationService
  ) {}

  ngOnInit() {
    this.createPersonalInfoForm();
    this.getPersonalInfo();
  }

  createPersonalInfoForm() {
    this.attorneyInformationForm = this.fb.group({
      HiredAttorney: ['', [Validators.required]],
      State: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Attorney: ['', [Validators.required]],
      LawFirm: ['', [Validators.required]],
      FirstName: ['', [Validators.maxLength(15)]],
      MiddleName: ['', [Validators.maxLength(15)]],
      LastName: ['', [Validators.maxLength(25)]],
      PhoneNumber: ['', [Validators.minLength(12), Validators.maxLength(12)]],
      StreetAddress: ['', [Validators.minLength(1), Validators.maxLength(35)]],
      TextCity: ['', [Validators.minLength(1), Validators.maxLength(25)]],
      TextState: ['', [Validators.minLength(2), Validators.maxLength(2)]],
      Zip: ['', [Validators.minLength(5), Validators.maxLength(10)]],
      EmailAddress: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(25)]
      ]
    });
    this.states = [{ code: 'GEORGIA', value: 'GEORGIA' }];
    this.cities = [{ code: 'COLUMBUS', value: 'COLUMBUS' }];
    this.attorneys = [{ code: 'NIKKI_ROYSTER', value: 'NIKKI ROYSTER' }];
    this.lawFirms = [
      { code: 'NIKKI_ROYSTER_ASSOCIATES', value: 'NIKKI ROYSTER & ASSOCIATES' }
    ];
  }
  getPersonalInfo() {
    this.showLoader = true;
    const requestData = {
      data: {
        EmailId:
          this.sessionService.getSessionVar('userID') ||
          this.cookieService.get('userID')
      }
    };
    this.httpHelper
      .httpPost('/api/fn-attorneyinfo', requestData, {}, true)
      .subscribe((res: any) => {
        this.showLoader = false;
        if (res.status === 'SUCCESS') {
          this.onResultSuccess(res);
        } else {
          this.onResultFailure(res);
        }
      });
  }
  onResultSuccess(response: any): void {}

  onResultFailure(response: any): void {}

  get attorneyInformationControls(): any {
    return this.attorneyInformationForm.controls;
  }

  // To save, monitoring  Login details
  monitoringData(value: string): any {
    this.monitorService.logEvent('ATTORNEY-ATTORNEY_INFORMATION_' + value);
  }

  // navigate(event) {
  //   event.preventDefault();
  //   this.router.navigate(['pages/attorney-login']);
  // }

  saveStatus() {
    this.monitoringData('UPDATING_STATUS');
    this.showLoader = true;

    const requestData = {
      data: this.attorneyInformationForm.value
    };
    // https://victor-dev-e-us-fa-attorney.azurewebsites.net/api/fn-attorneyinfo
    this.httpHelper
      .httpPost('/api/fn-attorneyinfo', requestData, {}, true)
      .subscribe((res: any) => {
        this.showLoader = false;
        if (res.status === 'SUCCESS') {
          this.onLoginSuccess(res);
        } else {
          this.onLoginFailure(res);
        }
      });
  }

  onLoginSuccess(response: any): void {}

  onLoginFailure(response: any): void {}
}
