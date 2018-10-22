import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpHelperService } from '../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../services/monitor.service';
import { AuthenticationService } from '../../../../services/authentication.service';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DialogServiceService } from '../../../../services/dialog-service.service';
import { SessionService } from '../../../../services/session.service';

import * as moment from 'moment';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {
  public updateStatusForm: FormGroup;
  public showLoader: boolean;
  public caseStatus: Array<any> = [];
  private selectedCase: any;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(public router: Router,
    private fb: FormBuilder,
    private httpHelper: HttpHelperService,
    private monitorService: MyMonitoringService,
    private authentication: AuthenticationService,
    public dialogService: DialogServiceService,
    private sessionService: SessionService) { }

  ngOnInit() {
    this.createUpdateStatusForm();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', showWeekNumbers: false });

    this.caseStatus = [
      { code: 'SETTLED', value: 'SETTLED' },
      { code: 'PATIENT_STILL_TREATING', value: 'PATIENT STILL TREATING' },
      { code: 'NEGOTIATIONS', value: 'NEGOTIATIONS' },
      { code: 'LITIGATIONS', value: 'LITIGATIONS' },
      { code: 'DROPPED/LOST_CASE', value: 'DROPPED/LOST CASE' },
    ];

    if (this.sessionService.getSessionVar('CASE')) {
      this.selectedCase = this.sessionService.getSessionVar('CASE');
      this.bindUpdateStatus();
    }

  }

  createUpdateStatusForm() {
    this.updateStatusForm = this.fb.group({
      CaseStatus: ['', [Validators.required]],
      SettlementDate: ['', [Validators.required]],
      LienPayDate: ['', [Validators.required]],
      TreatmentCompleteDate: ['', [Validators.required]],
      NegotiationsDate: ['', [Validators.required]]
    });
  }

  bindUpdateStatus() {
    const caseStatus = this.selectedCase.StatusInfo.CaseStatus;
    this.updateStatusControls.CaseStatus.setValue(this.selectedCase.StatusInfo.CaseStatus);

    switch (caseStatus) {
      case 'SETTLED':
        this.updateStatusControls.SettlementDate
        .setValue(this.convertDateFormat(this.selectedCase.StatusInfo.SettlementDate));

        this.updateStatusControls.LienPayDate
        .setValue(this.convertDateFormat(this.selectedCase.StatusInfo.LienPayDate));

        break;

      case 'PATIENT_STILL_TREATING':
        this.updateStatusControls.TreatmentCompleteDate
        .setValue(this.convertDateFormat(this.selectedCase.StatusInfo.TreatmentCompleteDate));

        break;

      case 'NEGOTIATIONS':
        this.updateStatusControls.NegotiationsDate
        .setValue(this.convertDateFormat(this.selectedCase.StatusInfo.NegotiationsDate));

        break;
    }
  }

  convertDateFormat(dateString) {
    return moment(dateString).format('MM/DD/YYYY');
  }

  // To save, monitoring  Login details
  monitoringData(value: string): any {
    this.monitorService.logEvent('ATTORNEY-UPDATE_STATUS_' + value);
  }

  get updateStatusControls(): any {
    return this.updateStatusForm.controls;
  }

  // navigate(event) {
  //   event.preventDefault();
  //   this.router.navigate(['pages/attorney-login']);
  // }

  saveStatus() {
    this.monitoringData('UPDATING_STATUS');
    this.showLoader = true;

    const requestData = {
      data: {
        StatusInfo: this.updateStatusForm.value,
        CaseID: this.sessionService.getSessionVar('CASE').CaseId
      }

    };

    this.httpHelper.httpPost('/api/fn-statusinfo', requestData, {}, true).subscribe((res: any) => {
      this.showLoader = false;
      if (res.status === 'SUCCESS') {
        this.onResultSuccess(res);
      } else {
        this.onResultFailure(res);
      }
    });
  }

  onResultSuccess(response: any): void {
    this.dialogService.showPopup({
      popupShow: true,
      popupFailureBtn: '',
      popupHeader: 'Information',
      popupMessage:
        response.message || 'Case status has been updated successfully',
      popupSuccessBtn: 'Ok'
    });
  }

  onResultFailure(response: any): void {
    this.dialogService.showPopup({
      popupShow: true,
      popupFailureBtn: '',
      popupHeader: 'Information',
      popupMessage:
        response.message || 'Something went wrong while saving information',
      popupSuccessBtn: 'Ok'
    });
  }

  navigate(pageName: string) {
    pageName = `pages/${pageName}`;
    this.router.navigate([pageName]);
  }

}
