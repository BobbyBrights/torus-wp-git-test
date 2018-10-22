import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpHelperService } from '../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../services/monitor.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ValidationService } from '../../../../services/validation.service';
import { SessionService } from '../../../../services/session.service';
import { DialogServiceService } from '../../../../services/dialog-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-settlement-details',
  templateUrl: './settlement-details.component.html',
  styleUrls: ['./settlement-details.component.scss']
})
export class SettlementDetailsComponent implements OnInit {
  public settlementDetailsForm: FormGroup;
  public showLoader: boolean;
  public loadingText = 'Loading...';
  public caseStatus: Array<any> = [];
  public states: Array<any> = [];
  public cities: Array<any> = [];
  public showDropdown = false;
  public showAutoCompleteStateLoader = false;
  public showAutoCompleteCityLoader = false;
  public zipCodeError: boolean;
  private selectedCase: any;
  private madeEdit: boolean;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    public router: Router,
    public validation: ValidationService,
    private fb: FormBuilder,
    private http: HttpHelperService,
    private monitorService: MyMonitoringService,
    private authentication: AuthenticationService,
    private sessionService: SessionService,
    public dialogService: DialogServiceService
  ) {}

  get settlementDetailsFormControls() {
   return this.settlementDetailsForm.controls;
  }

  ngOnInit() {
    this.createSettlementForm();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue' });
    this.settlementDetailsFormControls.State.disable();
    if (this.sessionService.getSessionVar('CASE')) {
      this.selectedCase = this.sessionService.getSessionVar('CASE');
      this.getPatientInfo();
      this.togglePatientInfo('disable');
      this.settlementDetailsFormControls.State.disable();

      this.bindSettlementInfo();
    }

    this.settlementDetailsFormControls.Zip.valueChanges.subscribe((zipValue: any) => {
      this.getZipInfo(zipValue, 'settlementDetailsFormControls');
    });


  }

  createSettlementForm() {
    this.settlementDetailsForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.maxLength(15)]],
      MiddleName: ['', [Validators.maxLength(15)]],
      LastName: ['', [Validators.required, Validators.maxLength(25)]],
      PhoneNumber: ['',
      [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12)
      ]
      ],
      StreetAddress: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(35)
      ]],
      City: ['',  [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(25)
      ]],
      State: ['',
     [ Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2)
    ]],
      Zip: ['',  [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10)
      ]],
      isClientInfo: [''],
      SettlementDate: [''],
      SettlementAmount: [''],
      TotalMedicals: ['']
    });
  }

  bindSettlementInfo() {
    this.settlementDetailsFormControls.SettlementAmount.setValue(this.selectedCase.SettlementInfo.SettlementAmount);
    this.settlementDetailsFormControls.SettlementDate.setValue(this.convertDateFormat(this.selectedCase.SettlementInfo.SettlementDate));
    this.settlementDetailsFormControls.TotalMedicals.setValue(this.selectedCase.SettlementInfo.TotalMedicals);
    this.settlementDetailsFormControls.isClientInfo.setValue(this.selectedCase.SettlementInfo.isClientInfo);
  }

  togglePatientInfo(mode: string) {
    if (mode === 'enable') {
      this.madeEdit = true;
    }
    this.settlementDetailsFormControls.FirstName[mode]();
    this.settlementDetailsFormControls.MiddleName[mode]();
    this.settlementDetailsFormControls.LastName[mode]();
    this.settlementDetailsFormControls.StreetAddress[mode]();
    this.settlementDetailsFormControls.PhoneNumber[mode]();
    this.settlementDetailsFormControls.Zip[mode]();
    this.settlementDetailsFormControls.City[mode]();
  }

  getZipInfo(zipCode, formGroup) {
    this.zipCodeError = false;
    if (zipCode.length === 5) {
      const requestData = {
        zipcode: zipCode
      };
      this.showLoader = true;
      this.loadingText = 'Getting State, County and Cities...';

      this.http.httpPost(`/api/fn-zipcode`, requestData, {}, true).subscribe((res: any) => {
        console.log(res);
        this.showLoader = false;
        this.loadingText = 'Loading...';
        if (res.status === 'SUCCESS') {
          this[formGroup].State.setValue(res.data.stateData.State);
          this[formGroup].City.setValue(res.data.cityData[0].CityName);

          if (res.data.cityData.length > 1) {
            this.cities = res.data.cityData;
          }
        } else {
          this.zipCodeError = true;
        }
      });
    } else {
      this.cities = [];
    }
  }

  getPatientInfo() {
    this.showLoader = true;
    this.loadingText = 'Loading...';
    const requestData = {
      data: {
        userId:  this.selectedCase.PatientId,
        properties: ['FirstName', 'LastName', 'middleName', 'streetAddress',
         'ZIPCode', 'State', 'CityName', 'telePhone1']
      }
    };

    this.http.httpPost('/api/fn-patientInfo', requestData, {}, true)
    .subscribe((res: any) => {
      this.showLoader = false;
      if (res.status === 'SUCCESS') {
        this.onPatientInfoSuccess(res);
      } else {
        this.onPatientInfoFailure(res);
      }
    });
  }

  onPatientInfoSuccess(response: any) {
    const patientInfo = response.data;
    this.settlementDetailsFormControls.FirstName.setValue(patientInfo.FirstName || '');
    this.settlementDetailsFormControls.MiddleName.setValue(patientInfo.MiddleName || '');
    this.settlementDetailsFormControls.LastName.setValue(patientInfo.LastName || '');
    this.settlementDetailsFormControls.StreetAddress.setValue(patientInfo.streetAddress || '');
    this.settlementDetailsFormControls.PhoneNumber.setValue(patientInfo.telePhone1 || '');
    this.settlementDetailsFormControls.Zip.setValue(patientInfo.ZIPCode || '');
  }

  onPatientInfoFailure(response: any) {}

  saveSettlementDetails() {
    this.showLoader = true;
    this.loadingText = 'Saving...';
    const requestData: any = {
      data: {
        SettlementInfo: this.settlementDetailsForm.value,
        CaseID: this.sessionService.getSessionVar('CASE').CaseId,

      }
    };

    if (this.madeEdit) {
      requestData.data.PatientInfo = {
        FirstName: this.settlementDetailsForm.value.FirstName,
        MiddleName : this.settlementDetailsForm.value.MiddleName,
        LastName : this.settlementDetailsForm.value.LastName,
        streetAddress : this.settlementDetailsForm.value.StreetAddress,
        telePhone1 : this.settlementDetailsForm.value.PhoneNumber,
        ZIPCode : this.settlementDetailsForm.value.Zip,
        State : this.settlementDetailsForm.value.State,
        City : this.settlementDetailsForm.value.City
      };
    }

    this.http.httpPost('/api/fn-settlementinfo', requestData, {}, true)
    .subscribe((res: any) => {
      this.showLoader = false;
      this.loadingText = 'Loading...';
      if (res.status === 'SUCCESS') {
        this.onSaveSettlementSuccess(res);
      } else {
        this.onSaveSettlementFailure(res);
      }
    });
  }

  onSaveSettlementSuccess(response: any) {
    this.dialogService.showPopup({
      popupShow: true,
      popupFailureBtn: '',
      popupHeader: 'Information',
      popupMessage:
        response.message || 'Settlement details has been updated successfully',
      popupSuccessBtn: 'Ok'
    });
  }

  onSaveSettlementFailure(response: any) {
    this.dialogService.showPopup({
      popupShow: true,
      popupFailureBtn: '',
      popupHeader: 'Information',
      popupMessage:
        response.message || 'Something went wrong while saving information',
      popupSuccessBtn: 'Ok'
    });
  }

  convertDateFormat(dateString) {
    return moment(dateString).format('MM/DD/YYYY');
  }
}
