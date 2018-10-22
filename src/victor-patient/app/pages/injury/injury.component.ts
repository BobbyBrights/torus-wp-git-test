/* ---------------------------------------------------------------------------
    UI Framework    : Angular
    Version         : 5.0
    Build ID        : 0
    Modified By     : Admin
    Modified Date   : 2018-Sep-20 10:30 AM
    Component Name  : Injury Details
  --------------------------------------------------------------------------- */

// Imports
import { Component, OnInit } from '@angular/core';
import { HttpHelperService } from '../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../services/monitor.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DialogServiceService } from '../../../../services/dialog-service.service';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from '../../../../services/session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../../../../services/authentication.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

// Component Definition
@Component({
  selector: 'app-injury',
  templateUrl: './injury.component.html',
  styleUrls: ['./injury.component.scss']
})
export class InjuryComponent implements OnInit {

  // Variable Declaration
  public injuryData: any = {
    thisWrech: {},
    beforeWrech: {}
  };
  public showInjuryConfirmationPopup = false;
  public sameInjury: Array<any> = [];
  public strSameInjuries = '';

  public selectedInjuriesNow: Array<any> = [];
  public selectedInjuriesBefore: Array<any> = [];
  public showLoader = false;
  public loaderText = 'Save Inprogress...';
  public timedOutSub: any;

  constructor(private route: ActivatedRoute, private http: HttpHelperService,
    private myMonitoringService: MyMonitoringService, private router: Router,
    public dialogService: DialogServiceService, private cookieService: CookieService,
    private sessionService: SessionService,
    private authentication: AuthenticationService) { }

  // To handle initialization of ng load
  ngOnInit() {
    this.myMonitoringService.logPageView('INJURY_INPROGRESS', '/injury');
    this.getInjuryData();

    this.timedOutSub = this.authentication.timedOut$.subscribe((res: any) => {
      this.confirmInjuries();
    });
  }

  // To Unsubscribe
  ngOnDestroy(): void {
    this.myMonitoringService.logPageView('INJURY_LEFT', '/injury');
    this.timedOutSub.unsubscribe();
  }

  getInjuryData() {
    this.showLoader = true;
    this.loaderText = 'Loading...';
    const requestData = {
      data: {
        user_id: this.sessionService.getSessionVar('userID') || this.cookieService.get('userID'),
        screen_name: 'PatientInjury'
      }
    };

    this.http.httpPost('/api/fn-screeninfo', requestData, httpOptions).subscribe((res: any) => {

      this.showLoader = false;
      if (res.status === 'SUCCESS') {
        // this.injuryData = JSON.parse(res.data);
        if (res.data && res.data !== '') {
          const resultData = res.data;
          this.bindInjuryData(resultData);
        }
      }
    });
  }

  bindInjuryData(resultData?: any) {
    const resultDataInjuredBodyParts = resultData.InjuredBodyParts;
    const resultDataInjuredPartsMedical = resultData.InjuredPartsforMedical;
    resultDataInjuredBodyParts.forEach((bodyParts) => {
      this.injuryData.thisWrech[bodyParts] = true;
    });
    resultDataInjuredPartsMedical.forEach((injuredPartsMedical) => {
      this.injuryData.beforeWrech[injuredPartsMedical] = true;
    });

    this.injuryData.thisWrech.other =  resultData.Others.InjuredBodyParts;
    this.injuryData.beforeWrech.other =  resultData.Others.InjuredPartsforMedical;
  }

  // To save Injury details
  saveInjuryData(isPrev?: boolean, isSaveExit?: boolean): any {
    this.showLoader = true;
    this.myMonitoringService.logEvent('SAVING');
    const requestData: any = {
      data: {
        injury: {
          InjuredBodyParts: this.selectedInjuriesNow,
          InjuredPartsforMedical: this.selectedInjuriesBefore,
          Others: {
            InjuredBodyParts: this.injuryData.thisWrech.other,
            InjuredPartsforMedical: this.injuryData.beforeWrech.other
          }
        },
        user_id: this.sessionService.getSessionVar('userID') || this.cookieService.get('userID'),
        save: false,
        screen_name: (isPrev || isSaveExit) ? 'PatientInjury' : 'PatientDocToSign'
      }
    };

    this.http.httpPost('/api/fn-injuryscreen', requestData, httpOptions).subscribe((res: any) => {
      this.showLoader = false;
      this.myMonitoringService.logEvent('SAVE-FAILURE');
      if (res.status === 'SUCCESS') {
        this.myMonitoringService.logEvent('SAVE-SUCCESS');
        if (isPrev) {
          this.router.navigate(['pages/patient-survey-two']);
        } else if (isSaveExit) {
          this.dialogService.showSaveReturnPopup(true);
        } else {
          this.router.navigate(['pages/documentssign']);
        }
      }
    });
  }

  // To confirm injuries by showing a popup
  confirmInjuries(isSaveAndExit?: boolean, isPrev?: boolean): void {
    this.selectedInjuriesNow = [];
    this.selectedInjuriesBefore = [];
    this.sameInjury = [];

    // this wrech loop
    for (const injuriesNow in this.injuryData.thisWrech) {
      if (this.injuryData.thisWrech[injuriesNow]) {
        if (injuriesNow !== 'other') {
          this.selectedInjuriesNow.push(injuriesNow);
        }

      }
    }

    // before wrech injuries loop
    for (const injuriesBefore in this.injuryData.beforeWrech) {
      if (this.injuryData.beforeWrech[injuriesBefore]) {
        if (injuriesBefore !== 'other') {
          this.selectedInjuriesBefore.push(injuriesBefore);
        }
      }
    }

    // compare thiswrech selected items with beforewrech selected items
    this.selectedInjuriesNow.forEach((selectedThisInjury) => {
      this.selectedInjuriesBefore.forEach((selectedBeforeInjury) => {
        if (selectedThisInjury === selectedBeforeInjury && selectedBeforeInjury !== 'None') {
          // if (!isSaveAndExit && !isPrev) {
          //   this.showInjuryConfirmationPopup = true;
          // }
          this.sameInjury.push(selectedThisInjury);
        }
      });
    });
    this.strSameInjuries = this.sameInjury.join(', ');
    if (isSaveAndExit) {
      this.saveInjuryData(false, true);
    } else if (isPrev) {
      this.saveInjuryData(true, false);
    } else {
      this.saveInjuryData();
    }
    // } else if (!this.showInjuryConfirmationPopup) {
    //   this.saveInjuryData();
    // }
  }

  // To handle the selection change event of this wrech
  thisWrechChanged(event) {
    this.injuryData.thisWrech.None = false;
  }

  // To handle the selection change event of before wrech
  beforeWrechChanged(event) {
    this.injuryData.beforeWrech.None = false;
  }

  // To Close Popup and navigate
  closePopup(getVal): void {
    this.showInjuryConfirmationPopup = false;
    if (getVal === 'yes') {
      this.myMonitoringService.logEvent('Injury popup \'yes\' button clicked from Injury Screen');
      this.saveInjuryData();
    } else if (getVal === 'no') {
      this.myMonitoringService.logEvent('Injury popup \'no\' button clicked from Injury Screen');
    }
  }

  // To save, monitoring  Login details
  monitoringData(getVal): any {
    this.myMonitoringService.logEvent('INJURY_' + getVal);
  }

  // To navigate screen
  navigate(clickedfrom) {
    if (clickedfrom === 'PREV') {
      this.monitoringData('PREVIOUS_CLICKED');
      this.confirmInjuries(false, true);
    } else if (clickedfrom === 'NEXT') {
      this.confirmInjuries(false, false);
      this.monitoringData('NEXT_CLICKED');
    }
  }

  // Event rises when the popup exits
  onSuccessPopup() {
    // claimsuccess
    this.authentication.logOut();
    this.dialogService.changePopupRoute('login');
  }

  onFailurePopup() {
    this.dialogService.hidePopup();
  }

  exitPopup() {
    this.monitoringData('EXIT-VICTOR_CLICKED');
    this.dialogService.showExitPopup(true);
  }

  saveAndReturnPopup() {
    this.monitoringData('SAVE-RETURN_CLICKED');
    this.confirmInjuries(true);
  }
}
