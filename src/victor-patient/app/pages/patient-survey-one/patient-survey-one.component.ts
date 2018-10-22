/* ---------------------------------------------------------------------------
    UI Framework    : Angular
    Version         : 5.0
    Build ID        : 0
    Modified By     : Admin
    Modified Date   : 2018-Sep-22 05:30 AM
    Component Name  : Patient Survey Screen

  --------------------------------------------------------------------------- */

// Imports
import { Component, OnInit } from '@angular/core';
import { HttpHelperService } from '../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../services/monitor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogServiceService } from '../../../../services/dialog-service.service';
import { UserIdleService } from '../../../../services/user-idle.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionService } from '../../../../services/session.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../../../../services/authentication.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

// Component Definition
@Component({
  selector: 'app-patient-survey-one',
  templateUrl: './patient-survey-one.component.html',
  styleUrls: ['./patient-survey-one.component.scss']
})

export class PatientSurveyOneComponent implements OnInit {
  // Variable Declaration
  public accDataOne: any = {};
  public accDataTwo: any = {};
  public page = '1'; // With this property we navigate from register survey's page 1 to page 2.

  public years: Array<number> = [];
  public days: Array<number> = [];
  public months: Array<any> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public comboNumbers: Array<any> = ['None'];
  public lawEnforcements: Array<any> = [
    {
      name: 'United States Marshal Service',
      code: 'USMS'
    },
    {
      name: 'Federal Bureau of Investigation',
      code: 'FBI'
    },
    {
      name: 'Federal Bureau of Prisons',
      code: 'FBP'
    },
    {
      name: 'Office of Inspector General',
      code: 'OIG'
    }
  ];

  public loadingText = 'Save Inprogress...';

  public states: Array<any> = [];
  public counties: Array<any> = [];
  public cities: Array<any> = [];

  public selectedState: any = {};
  public selectedCounty: any = {};
  public selectedCity: any = {};

  // List of booleans
  public showTimer = false;
  public showAutoCompleteLoader = false;
  public showCountyCompleteLoader = false;
  public showCityCompleteLoader = false;
  public showLoader = false;

  // subscriptions
  private startWatchingSub: any;
  private idleResetSub: any;

  // properties for popup route
  public popupShow = false;
  public popupRoute = '';
  public popupHeader = '';
  public popupMessage = '';
  public popupSuccessBtn = 'Continue';
  public popupFailureBtn = 'Cancel';
  public timedOutSub: any;

  constructor(
    private http: HttpHelperService,
    private myMonitoringService: MyMonitoringService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogServiceService,
    private userIdle: UserIdleService,
    private sessionService: SessionService,
    private cookieService: CookieService,
    private authentication: AuthenticationService) { }


  // To handle initialization of ng load
  ngOnInit() {
    this.myMonitoringService.logPageView('PATIENT-SURVEY-ONE_INPROGRESS', '/patient-survey');
    this.generateYears(1980, 2018);
    this.getSurveyData();
    this.generateNumbers(100);
    this.timedOutSub = this.authentication.timedOut$.subscribe((res: any) => {
      this.saveRegSurvey(false, false, true);
    });
  }
  // To Unsubscribe
  ngOnDestroy(): void {
    this.myMonitoringService.logPageView('PATIENT-SURVEY-ONE_LEFT', '/patient-survey');
    this.timedOutSub.unsubscribe();
  }

  // To generate years
  generateYears(startYear, endYear): void {
    for (let i = startYear; i < endYear; i++) {
      this.years.push(startYear++);
    }
  }

  // To get the saved data of register survey
  getSurveyData() {
    this.showLoader = true;
    this.loadingText = 'Loading...';
    const requestData = {
      data: {
        user_id: this.sessionService.getSessionVar('userID') || this.cookieService.get('userID'),
        screen_name: (this.page === '1') ? 'PatientRegistrySurvey_1' : 'PatientRegistrySurvey_2'
      }
    };


    this.http.httpPost('/api/fn-screeninfo', requestData, httpOptions).subscribe((res: any) => {
      this.showLoader = false;
      if (res.status === 'SUCCESS') {
        if (res.data && res.data !== '') {
            this.accDataOne = res.data;
        }
      }
    });
  }

  // To calculate the days in month
  daysInMonth(month?: any, year?: any) {
    year = (year) ? year : new Date().getFullYear();
    month = (month) ? month : new Date().getMonth();

    return (new Date(year, month, 0).getDate() + 1);
  }

  onAccidentDateChange() {
    const daysInMonth = this.daysInMonth(this.accDataTwo.accidentMonth, this.accDataTwo.accidentYear);
    this.days = [];
    for (let i = 1; i < daysInMonth; i++) {
      this.days.push(i);
    }
  }

  onStateSelect() {
  }

  // To save, monitoring  Login details
  monitoringData(getVal): any {
    this.myMonitoringService.logEvent('PATIENT-SURVEY-ONE_' + getVal);
  }

  // To generate numbers for combos
  generateNumbers(num) {
    for (let i = 1; i < num; i++) {
      this.comboNumbers.push(i);
    }
  }

  // Dropdown search functions for state county and state

  getState(stateKey: string, hideLoad?: boolean) {
    (hideLoad) ? this.showAutoCompleteLoader = true : '';
    const requestData = {
      state: stateKey
    };

    this.http.httpPost(`/api/fn-getstate`, requestData, httpOptions).subscribe((res: any) => {
      (hideLoad) ? this.showAutoCompleteLoader = false : '';
      if (res.status === 'success') {
        this.states = res.result;
      }
      console.log(res);
    });
  }

  getCounty(countyKey: string, hideLoad?: boolean) {
    (hideLoad) ? this.showCountyCompleteLoader = true : '';
    const requestData = {
      county: countyKey,
      state_id: this.selectedState._id
    };

    this.http.httpPost(`/api/fn-getcounty`, requestData, httpOptions).subscribe((res: any) => {
      (hideLoad) ? this.showCountyCompleteLoader = false : '';
      if (res.status === 'success') {
        this.counties = res.result;
      }
      console.log(res);
    });
  }

  getCity(cityKey: string, hideLoad?: boolean) {
    (hideLoad) ? this.showCityCompleteLoader = true : '';
    const requestData = {
      city: cityKey,
      county_id: this.selectedCounty._id
    };

    this.http.httpPost(`/api/fn-getcity`, requestData, httpOptions).subscribe((res: any) => {
      (hideLoad) ? this.showCityCompleteLoader = false : '';
      if (res.status === 'success') {
        this.cities = res.result;
      }
      console.log(res);
    });
  }

  setState(item) {
    this.selectedState = item.item;
    this.accDataTwo.State = item.value;
  }

  setCounty(item) {
    this.selectedCounty = item.item;
    this.accDataTwo.AccidentOccurCounty = item.value;
  }

  setCity(item) {
    this.selectedCity = item.item;
    this.accDataTwo.AccidentOccurCity = item.value;
  }


  /*
  Saves the Register Survey

  ** THE BELOW PARAMS ARE USED TO SAVE AT DIFFERENT BUTTON CLICKS **

  @param: isPrev = to detect previous button click,
  @param: isSaveExit = To detect whether the user clicked save and exit,
  @param: isTimedOut = To detect the session timeout
  */
  saveRegSurvey(
    isPrev?: boolean, isSaveExit?: boolean,
    isTimedOut?: boolean) {

    this.showLoader = true;
    const requestData = {
      data: {
        user_name: this.sessionService.getSessionVar('userID') || this.cookieService.get('userID'),
        survey_data: (this.page === '1') ? this.accDataOne : this.accDataTwo,
        last_page_name: (isPrev || isSaveExit || isTimedOut) ? 'PatientRegistrySurvey_1' : 'PatientRegistrySurvey_2'
      }
    };

    this.monitoringData('SAVING');

    this.http.httpPost('/api/fn-surveyscreen1', requestData, httpOptions).subscribe((res: any) => {
      this.showLoader = false;
      this.monitoringData('SAVE-FAILED');
      if (res.status === 'SUCCESS') {
        this.monitoringData('SAVE-SUCCESS');
        if (isSaveExit) {
          this.onSaveExit(res);
        } else if (isPrev) {
          this.onSavePrev(res);
        } else if (isTimedOut) {
          this.onSaveTimeOut();
        } else {
          this.onSaveRegSurveySuccess(res);
        }
      }
    });
  }

  onSaveExit(response?: any): void {
    this.dialogService.showSaveReturnPopup(true);
  }

  onSavePrev(response?: any): void {
    // this.router.navigate(['patient-survey-one']);
  }

  onSaveTimeOut(response?: any): void {
    this.authentication.logOut();
    this.router.navigate(['login']);
  }

  onSaveRegSurveySuccess(response?: any): void {
    this.router.navigate(['pages/patient-survey-two']);
  }

  onSaveRegSurveyFailure(response: any): void {

  }

  // To navigate screen
  navigate(from) {
    if (from === 'NEXT') {
      this.saveRegSurvey();
    } else if (from === 'PREV') {
      this.saveRegSurvey(true);
    }
  }

  // Event rises when the popup exits
  onSuccessPopup() {
    this.authentication.logOut();
    this.dialogService.changePopupRoute('login');
  }

  exitPopup() {
    this.monitoringData('Exit-Victor_CLICKED');
    this.dialogService.showExitPopup(true);
  }

  saveAndReturnPopup() {
    this.monitoringData('Save-Return_CLICKED');
    this.saveRegSurvey(false, true);

  }

}
