import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { HttpHelperService } from '../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../services/monitor.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SessionService } from '../../../../services/session.service';
import { DialogServiceService } from '../../../../services/dialog-service.service';
import { CookieService } from 'ngx-cookie-service';
import { ValidationService } from '../../../../services/validation.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-attorney-login-account-info',
  templateUrl: './attorney-login-account-info.component.html',
  styleUrls: ['./attorney-login-account-info.component.scss']
})
export class AttorneyLoginAccountInfoComponent implements OnInit {
  public logInfoVisible: boolean;
  public accountInfoVisible: boolean;
  public LogInfo: FormGroup;
  public AccountInfo: FormGroup;
  public showAlert: boolean;
  public updatePassStatus: boolean;
  public message: string;
  public profilPicData: any;
  public profileImageName: string;
  public passwordCheckErrMsg: any;
  public inValidForm: boolean;
  public showLoader = false;
  public fileName = '';
  public loadingText: string;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    public router: Router,
    public validation: ValidationService,
    private fb: FormBuilder,
    private httpHelper: HttpHelperService,
    private monitorService: MyMonitoringService,
    private authentication: AuthenticationService,
    private sessionService: SessionService,
    public dialogService: DialogServiceService,
    private cookieService: CookieService
  ) {
    this.inValidForm = true;
    this.passwordCheckErrMsg = false;
    this.logInfoVisible = true;
    this.accountInfoVisible = false;
    this.LogInfo = this.fb.group({
      CurrentPassword: ['', [Validators.required]],
      NewPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)]],
      ConfirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)]]
    }, {
        validator: this.MatchPasswords
      });
    this.AccountInfo = this.fb.group({
      FirstName: ['', [Validators.required, Validators.maxLength(15)]],
      MiddleName: ['', [Validators.maxLength(15)]],
      LastName: ['', [Validators.required, Validators.maxLength(25)]],
      TelephoneDirect: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12)
        ]
      ],
      TelephoneMobile: [
        '',
        [Validators.minLength(12), Validators.maxLength(12)]
      ],
      SettlementDate: ['', Validators.required],
      profileImageName: [''],
      profileImage: ''
    });
  }
  get attorneyLogInfoControls(): any {
    return this.LogInfo.controls;
  }
  get attorneyAccountInfoControls(): any {
    return this.AccountInfo.controls;
  }

  ngOnInit() {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue' });
    this.bindProfileInfo();
  }
  // compareNewPassword() {
  //   if (this.LogInfo.value.NewPassword === this.LogInfo.value.ConfirmPassword) {
  //     this.passwordCheckErrMsg = false;
  //     this.inValidForm = false;
  //   } else {
  //     this.passwordCheckErrMsg = true;
  //     this.inValidForm = true;
  //   }
  // }

  bindProfileInfo() {
    const accountInfo = this.sessionService.getSessionVar('PROFILE_INFO') || {};
    this.attorneyAccountInfoControls.FirstName.setValue(accountInfo.FirstName || '');
    this.attorneyAccountInfoControls.MiddleName.setValue(accountInfo.MiddleName || '');
    this.attorneyAccountInfoControls.LastName.setValue(accountInfo.LastName || '');
    this.attorneyAccountInfoControls.TelephoneDirect.setValue(accountInfo.TelephoneDirect || '');
    this.attorneyAccountInfoControls.TelephoneMobile.setValue(accountInfo.TelephoneMobile || '');
    this.attorneyAccountInfoControls.SettlementDate.setValue(accountInfo.SettlementDate || '');
    // this.attorneyAccountInfoControls.profileImageName.setValue(accountInfo.profileImageName || '');
  }

  MatchPasswords(AC: AbstractControl) {
    const password = AC.get('NewPassword').value;
    const confirmPassword = AC.get('ConfirmPassword').value;
    if (password !== confirmPassword) {
      console.log('false');
      AC.get('ConfirmPassword').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }

  handleFileUpload(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const pattern = /image-*/;
    this.fileName = file.name;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      return 'invalid format';
    }
    this.profileImageName = `${
      this.sessionService.getSessionVar('userID').split('@')[0]
      }_${file.lastModified}_${file.name}`;
    reader.onload = event => {
      const fReader: any = event.target;
      this.profilPicData = fReader.result;
    };

    reader.readAsDataURL(file);
  }

  showLoginfo() {
    this.logInfoVisible = true;
    this.accountInfoVisible = false;
  }
  showAccountinfo() {
    this.logInfoVisible = false;
    this.accountInfoVisible = true;
  }
  logInfoSubmit() {
    console.log('Log Info Submit');
  }
  accountInfoSubmit() {
    console.log('Account Info Submit');
  }

  updatePassword(): void {
    this.showLoader = true;
    const requestData = {
      data: {
        emailID:
          this.sessionService.getSessionVar('userID') ||
          this.cookieService.get('userID'),
        CurrentPassword: this.LogInfo.value.CurrentPassword,
        NewPassword: this.LogInfo.value.NewPassword
      }
    };
    console.log(requestData);

    this.httpHelper
      .httpPost('/api/fn-attorneychangepassword', requestData, {}, true)
      .subscribe((res: any) => {
        this.showLoader = false;
        if (res.status === 'SUCCESS') {
          this.onUpdatePasswordSuccess(res);
        } else {
          this.onUpdatePasswordFailure(res);
        }
      });
  }

  onUpdatePasswordSuccess(response: any): void {
    console.log(response);
    this.dialogService.showPopup({
      popupShow: true,
      popupFailureBtn: '',
      popupHeader: 'Information',
      popupMessage:
        response.message || 'Your password has been changed successfully',
      popupSuccessBtn: 'Ok'
    });
  }
  onUpdatePasswordFailure(response: any): void {
    this.dialogService.showPopup({
      popupShow: true,
      popupFailureBtn: '',
      popupHeader: 'Error',
      popupMessage:
        response.message || 'Something went wrong while changing the password',
      popupSuccessBtn: 'Ok'
    });
  }

  // const requestData = {
  //   data: {
  //     user_id: this.sessionService.getSessionVar('userID') || this.cookieService.get('userID'),
  //     screen_name: 'PatientRegistrySurvey_2'
  //   }
  updateProfile(): void {
    this.showLoader = true;
    const attorneyData = this.AccountInfo.value;
    attorneyData.EmailId =
      this.sessionService.getSessionVar('userID') ||
      this.cookieService.get('userID');

    const requestData = {
      data: {
        attorney: attorneyData,
        profileImageName: this.profileImageName,
        profileImage: this.profilPicData
      }
    };

    this.httpHelper
      .httpPost('/api/fn-attorneyprofile', requestData, {}, true)
      .subscribe((res: any) => {
        this.showLoader = false;
        if (res.status === 'SUCCESS') {
          this.onUpdateProfileSuccess(res);
        } else {
          this.onUpdateProfileFailure(res);
        }
      });
  }

  onUpdateProfileSuccess(response: any): void {
    console.log(response);
    this.dialogService.showPopup({
      popupShow: true,
      popupFailureBtn: '',
      popupHeader: 'Information',
      popupMessage:
        response.message ||
        'Your account information has been saved successfully',
      popupSuccessBtn: 'Ok'
    });
  }

  onUpdateProfileFailure(response: any): void {
    this.dialogService.showPopup({
      popupShow: true,
      popupFailureBtn: '',
      popupHeader: 'Error',
      popupMessage:
        response.message ||
        'Something went wrong while saving the account information',
      popupSuccessBtn: 'Ok'
    });
  }

  navigate(pageName: string) {
    pageName = `pages/${pageName}`;
    this.router.navigate([pageName]);
  }
}
