/* ---------------------------------------------------------------------------
    UI Framework    : Angular
    Version         : 5.0
    Build ID        : 0
    Modified By     : Admin
    Modified Date   : 2018-Sep-22 10:30 AM
    Component Name  : Register Account(User) Screen

  --------------------------------------------------------------------------- */

// Imports
import { Component, OnInit } from '@angular/core';
import { HttpHelperService } from '../../../../../services/http-helper.service';
import { ValidationService } from '../../../../../services/validation.service';
import { MyMonitoringService } from '../../../../../services/monitor.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogServiceService } from '../../../../../services/dialog-service.service';
import { SessionService } from '../../../../../services/session.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AuthenticationService } from '../../../../../services/authentication.service';

declare var $: any;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

// Component Definition
@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.scss']
})

export class PatientRegisterComponent implements OnInit {
  public regStatus = false;
  public zipCodeError: boolean;

  public message = '';
  userRegData: any = {};

  // Variable Declaration
  public registerAcc: any = {
    telePhone1: {},
    telePhone2: {},
    State: {},
    City: {}
  };
  public countries: Array<any> = [];
  public states: Array<any> = [];
  public cities: Array<any> = [];
  public selectedState: any;
  public showValidationErrors = false;
  public showDropdown = false;

  public showLoader = false;
  public loadingText = 'Loading...';
  public showAutoCompleteStateLoader = false;
  public showAutoCompleteCityLoader = false;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private http: HttpHelperService,
    public validation: ValidationService,
    public myMonitoringService: MyMonitoringService,
    public router: Router,
    public dialogService: DialogServiceService,
    private sessionService: SessionService,
    private authentication: AuthenticationService) { }

  // To handle initialization of ng load
  ngOnInit() {
    this.myMonitoringService.logPageView('REGISTER_ACCOUNT_INPROGRESS', '/register');
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue' });
  }

  // Get state based on the user search
  getState(stateKey: string) {
    this.showAutoCompleteStateLoader = true;
    this.showDropdown = false;
    const requestData = {
      state: stateKey
    };

    this.http.httpPost(`/api/fn-getstate`, requestData, httpOptions).subscribe((res: any) => {
      this.showAutoCompleteStateLoader = false;
      if (res.status === 'SUCCESS') {
        if (res.data && res.data !== '') {
          this.showDropdown = true;
          this.states = res.data.result;
        }
      }
    });
  }

  // set selected state in the data
  setState(item) {
    // this.registerAcc.State = item.value;
  }

  // Get city based on the user search
  getCity(cityKey: string) {
    this.showAutoCompleteCityLoader = true;
    this.showDropdown = false;
    const requestData = {
      city: cityKey
    };

    this.http.httpPost(`/api/fn-getcity`, requestData, httpOptions).subscribe((res: any) => {
      this.showAutoCompleteCityLoader = false;
      if (res.status === 'SUCCESS') {
        if (res.data && res.data !== '') {
          this.showDropdown = true;
          this.cities = res.data.result;
        }
      }
    });
  }

  setCity(item) {
    this.registerAcc.City = item.item;
  }

  // To handle the change event of datepicker
  dateOfBirthChange(value) {

  }

  // To Unsubscribe
  ngOnDestroy(): void {

  }

  getZipInfo() {
    this.zipCodeError = false;
    if (this.registerAcc.ZIPCode.length === 5) {
      const requestData = {
        zipcode: this.registerAcc.ZIPCode
      };
      this.showLoader = true;
      this.loadingText = 'Getting State, County and Cities...';

      this.http.httpPost(`/api/fn-zipcode`, requestData, httpOptions).subscribe((res: any) => {
        console.log(res);
        this.showLoader = false;
        if (res.status === 'SUCCESS') {
          this.registerAcc.State = res.data.stateData;
          this.registerAcc.City = res.data.cityData[0];

          if (res.data.cityData.length > 1) {
            this.cities = res.data.cityData;
          }
        } else {
          this.zipCodeError = true;
        }
      });
    } else {
      this.registerAcc.State = {};
      this.registerAcc.City = {};
      this.cities = [];
    }
  }

  // To mask SSN
  maskSSN() {
    const numRegex = /^(?!000|666)[0-9]{3}$/;
    const numTwoRegex = /^(?!000|666)[0-9]{3}([ -]?)(?!00)[0-9]{2}$/;
    const ssnRegext = /^(?!000|666)[0-9]{3}([ -]?)(?!00)[0-9]{2}\1(?!0000)[0-9]{4}$/;

    if (this.registerAcc.SocialSecurityNo) {
      if (numRegex.test(this.registerAcc.SocialSecurityNo)) {
        this.registerAcc.SocialSecurityNo = this.registerAcc.SocialSecurityNo + '-';
      } else if (numTwoRegex.test(this.registerAcc.SocialSecurityNo)) {
        this.registerAcc.SocialSecurityNo = this.registerAcc.SocialSecurityNo + '-';
      } else if (ssnRegext.test(this.registerAcc.SocialSecurityNo)) {
        return true;
      }
    }
    return false;
  }


  // To mask zip code
  maskZipCode() {
    const zipOneRegex = /^[0-9]{5}$/;
    const zipTwoRegex = /^[0-9]{5}([ -]?)[0-9]{4}$/;

    if (this.registerAcc.ZIPCode) {
      if (zipOneRegex.test(this.registerAcc.ZIPCode)) {
        this.registerAcc.ZIPCode = this.registerAcc.ZIPCode + '-';
      } else if (zipTwoRegex.test(this.registerAcc.ZIPCode)) {
        return true;
      }
    }

    return false;
  }

  // To mask telephone number
  maskTelephone(telePhone) {
    const telePhoneOneRegex = /^[0-9]{3}$/;
    const telePhoneTwoRegex = /^[0-9]{3}([ -]?)[0-9]{3}$/;
    const telePhoneRegex = /^[0-9]{3}([ -]?)[0-9]{3}\1[0-9]{4}$/;

    if (telePhone) {
      if (telePhoneOneRegex.test(telePhone)) {
        telePhone = telePhone + '-';
      } else if (telePhoneTwoRegex.test(telePhone)) {
        telePhone = telePhone + '-';
      }
    }

    return telePhone;
  }

  // To monitor the events
  monitoringData(getVal): any {
    this.myMonitoringService.logEvent('REGISTER_ACCOUNT_' + getVal);
  }

  // To save the user registration details
  saveRegisterAccountData() {
    const telePhoneObjOne = { ...this.registerAcc.telePhone1 };
    const telePhoneObjTwo = { ...this.registerAcc.telePhone2 };

    const requestData: any = {
      data: { ...this.registerAcc }
    };
    if (this.registerAcc.telePhone1.number) {
      telePhoneObjOne.number = this.registerAcc.telePhone1.number.replace(/[^\w\s]/gi, '');
    }
    if (this.registerAcc.telePhone2.number) {
      telePhoneObjTwo.number = this.registerAcc.telePhone2.number.replace(/[^\w\s]/gi, '');
    }
    requestData.data.telePhone1 = telePhoneObjOne;
    requestData.data.telePhone2 = telePhoneObjTwo;
    requestData.data.type = this.sessionService.getSessionVar('userType');

    this.showLoader = true;
    this.loadingText = 'Registration In Progress...';

    this.http.httpPost(`/api/fn-register`, requestData, httpOptions).subscribe((res: any) => {
      this.showLoader = false;
      $('#RegisterSuccessModal').modal({ show: true });
      if (res.status === 'SUCCESS') {
        this.onRegistrationSuccess(res);
      } else {
        this.onRegistrationFailure(res);
      }
    });
  }

  onRegistrationSuccess(response?: any): void {
    this.regStatus = true;
    this.userRegData = response.data;
    this.authentication.setUserID(this.userRegData.USERID);
    this.myMonitoringService.setAuthentication(this.userRegData.USERID, '', true);
    this.message = 'Welcome to Victor, you have registered successfully. Please note down your USER ID and PASSWORD';
  }

  onRegistrationFailure(response?: any): void {
    this.regStatus = false;
    this.message = response.message || 'User Registration Failed';
  }

  onSuccessPopup() {
    this.dialogService.changePopupRoute('login');
  }

  exitPopup() {
    this.monitoringData('EXIT');
    this.dialogService.showExitPopup(true);
  }

  saveAndReturnPopup() {
    this.monitoringData('SAVE_AND_RETURN_LATER');
    this.dialogService.showSaveReturnPopup(true);
  }


  // To navigate between the screens
  navigate(param) {
    if (param === 'HOME') {
      this.monitoringData('HOME');
      this.router.navigate(['pages/patient-login']);
    } else if (param === 'REGISTER') {
      this.monitoringData('REGISTERING');
      this.saveRegisterAccountData();
    }
  }
}
