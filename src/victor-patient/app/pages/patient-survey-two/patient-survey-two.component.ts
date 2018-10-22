import { Component, OnInit } from '@angular/core';
import { HttpHelperService } from '../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../services/monitor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogServiceService } from '../../../../services/dialog-service.service';
import { UserIdleService } from '../../../../services/user-idle.service';
import { SessionService } from '../../../../services/session.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../../../../services/authentication.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ValidationService } from '../../../../services/validation.service';
import { timer } from 'rxjs/observable/timer';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Component({
  selector: 'app-patient-survey-two',
  templateUrl: './patient-survey-two.component.html',
  styleUrls: ['./patient-survey-two.component.scss']
})
export class PatientSurveyTwoComponent implements OnInit {
  zipCodeError: boolean;

  public patientSurveyTwoData: any = {
    AccidentOccurState: {},
    AccidentOccurCounty: {},
    AccidentOccurCity: {}
  };

  public loadingText = 'Save Inprogress...';
  public lawEnforcements: Array<any> = [
    {
      name: 'Select',
      code: ''
    },
    {
      name: 'City Police',
      code: 'City_Police'
    }, {
      name: 'State Police',
      code: 'State_Police'
    }, {
      name: 'Sheriff’s Department',
      code: 'Sheriffs_Department'
    },
    {
      name: 'Not Sure',
      code: 'Not_Sure'
    }
  ];

  public years: Array<number> = [];
  public days: Array<any> = [];
  public months: Array<any> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public comboNumbers: Array<any> = ['None'];
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
  public showStateDropdown = false;
  public showCountyDropdown = false;
  public showCityDropdown = false;


  public showLoader = false;
  bsConfig: Partial<BsDatepickerConfig>;

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
    private authentication: AuthenticationService,
    public validation: ValidationService
  ) { }

  ngOnInit() {
    this.myMonitoringService.logPageView('PATIENT-SURVEY-TWO_INPROGRESS', '/patient-survey');
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue' });
    this.generateYears(1980, new Date().getFullYear());
    this.getSurveyData();
    this.generateNumbers(100);

    this.timedOutSub = this.authentication.timedOut$.subscribe((res: any) => {
      this.saveRegSurvey(false, false, true);
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

  }

  // To generate numbers for combos
  generateNumbers(num) {
    for (let i = 1; i < num; i++) {
      this.comboNumbers.push(i);
    }
  }

  // To save, monitoring  Login details
  monitoringData(getVal): any {
    this.myMonitoringService.logEvent('PATIENT-SURVEY-TWO_LEFT' + getVal);
  }

  // To get the saved data of register survey
  getSurveyData() {
    this.showLoader = true;
    this.loadingText = 'Loading...';
    const requestData = {
      data: {
        user_id: this.sessionService.getSessionVar('userID') || this.cookieService.get('userID'),
        screen_name: 'PatientRegistrySurvey_2'
      }
    };


    this.http.httpPost('/api/fn-screeninfo', requestData, httpOptions).subscribe((res: any) => {
      this.showLoader = false;
      if (res.status === 'SUCCESS') {
        if (res.data && res.data !== '') {
          this.patientSurveyTwoData = res.data;
          this.patientSurveyTwoData.AccidentDate = new Date(res.data.AccidentDate);
          this.selectedState = res.data.AccidentOccurState;
          this.selectedCounty = res.data.AccidentOccurCounty;
          this.selectedCity = res.data.AccidentOccurCity;
          const accidentmonth = this.patientSurveyTwoData.AccidentMonth || 1;
          this.onAccidentDateChange();
        }
      }
    });
  }

  // getZipInfo() {
  //   this.zipCodeError = false;
  //   if (this.patientSurveyTwoData.ZIPCode.length === 5) {
  //     const requestData = {
  //       zipcode: this.patientSurveyTwoData.ZIPCode
  //     };
  //     this.showLoader = true;


  //     // timer(30000).subscribe((res: any) => {
  //     //   this.showLoader = false;
  //     // });

  //     this.loadingText = 'Getting State, County & Cities...';
  //     this.http.httpPost(`/api/fn-zipcode`, requestData, httpOptions).subscribe((res: any) => {
  //       console.log(res);
  //       this.showLoader = false;
  //       if (res.status === 'SUCCESS') {
  //         this.patientSurveyTwoData.AccidentOccurCounty = res.data.countyData;
  //         this.patientSurveyTwoData.AccidentOccurState = res.data.stateData;
  //         this.patientSurveyTwoData.AccidentOccurCity = res.data.cityData[0];
  //         this.selectedState = res.data.stateData;
  //         this.selectedCounty = res.data.countyData;
  //         this.selectedCity = res.data.cityData[0];

  //         if (res.data.cityData.length > 1) {
  //           this.cities = res.data.cityData;
  //         }
  //       } else {
  //         this.zipCodeError = true;
  //       }
  //     });
  //   } else {
  //     this.patientSurveyTwoData.AccidentOccurCounty = {};
  //     this.patientSurveyTwoData.AccidentOccurState = {};
  //     this.patientSurveyTwoData.AccidentOccurCity = {};
  //     this.cities = [];

  //     this.selectedState = {};
  //     this.selectedCounty = {};
  //     this.selectedCity = {};
  //   }
  // }

  lawEnforcementsChange() {
    if (this.patientSurveyTwoData.IsLawEnforcementDept === 'false' || this.patientSurveyTwoData.IsLawEnforcementDept === 'notSure' ) {
      this.patientSurveyTwoData.LawEnforcementDept = "";
    }

  }
  // Dropdown search functions for state county and state

  getState(stateKey: string, hideLoad?: boolean) {
    (hideLoad) ? this.showAutoCompleteLoader = true : '';
    this.showStateDropdown = false;
     this.patientSurveyTwoData.AccidentOccurCounty = {};
     this.patientSurveyTwoData.AccidentOccurCity = {};
    const requestData = {
      state: stateKey
    };

    this.http.httpPost(`/api/fn-getstate`, requestData, httpOptions).subscribe((res: any) => {
      (hideLoad) ? this.showAutoCompleteLoader = false : '';
      if (res.status === 'SUCCESS') {
        if (res.data && res.data !== '') {
          this.showStateDropdown = true;
          this.states = res.data.result;
        }
      }
    });
  }

  getCounty(countyKey: string, hideLoad?: boolean) {
    (hideLoad) ? this.showCountyCompleteLoader = true : '';
    this.showCountyDropdown = false;
     this.patientSurveyTwoData.AccidentOccurCity = {};
    const requestData = {
      county: countyKey,
      state_id: this.selectedState._id
    };

    this.http.httpPost(`/api/fn-getcounty`, requestData, httpOptions).subscribe((res: any) => {
      (hideLoad) ? this.showCountyCompleteLoader = false : '';
      if (res.status === 'SUCCESS') {
        if (res.data && res.data !== '') {
          this.showCountyDropdown = true;
          this.counties = res.data.result;
        }
      }
    });
  }

  getCity(cityKey: string, hideLoad?: boolean) {
    (hideLoad) ? this.showCityCompleteLoader = true : '';
    this.showCityDropdown = false;
    const requestData = {
      city: cityKey,
      county_id: this.selectedCounty._id
    };

    this.http.httpPost(`/api/fn-getcity`, requestData, httpOptions).subscribe((res: any) => {
      (hideLoad) ? this.showCityCompleteLoader = false : '';
      if (res.status === 'SUCCESS') {
        if (res.data && res.data !== '') {
          this.showCityDropdown = true;
          this.cities = res.data.result;
        }
      }
    });
  }

  setState(item) {
    this.selectedState = item.item;
    // this.patientSurveyTwoData.State = item.item;
    // this.patientSurveyTwoData.AccidentOccurCounty = {};
    // this.patientSurveyTwoData.AccidentOccurCity = {};

  }

  setCounty(item) {
    this.selectedCounty = item.item;
    // this.patientSurveyTwoData.AccidentOccurCity = {};
  }

  setCity(item) {
    this.selectedCity = item.item;
    this.patientSurveyTwoData.AccidentOccurCity = item.item;
  }

  // To generate years
  generateYears(startYear, endYear): void {
    for (let i = startYear; i < (endYear + 1); i++) {
      this.years.push(startYear++);
    }
  }

  // To calculate the days in month
  daysInMonth(month?: any, year?: any) {
    year = (year) ? year : new Date().getFullYear();
    month = (month) ? month : new Date().getMonth();

    return (new Date(year, month, 0).getDate() + 1);
  }

  onAccidentDateChange() {
    const daysInMonth = this.daysInMonth(this.patientSurveyTwoData.AccidentMonth, this.patientSurveyTwoData.AccidentYear);
    this.days = [];
    for (let i = 1; i < daysInMonth; i++) {
      this.days.push(i);
    }
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
    this.loadingText = 'Saving...';
    this.showLoader = true;
    const requestData = {
      data: {
        user_name: this.sessionService.getSessionVar('userID') || this.cookieService.get('userID'),
        survey_data: { ...this.patientSurveyTwoData },
        last_page_name: (isPrev || isSaveExit || isTimedOut) ? 'patientRegistrySurvey_2' : 'patientInjury'
      }
    };

    requestData.data.survey_data.AccidentOccurState = this.selectedState;
    requestData.data.survey_data.AccidentOccurCounty = this.selectedCounty;
    requestData.data.survey_data.AccidentOccurCity = this.selectedCity;
    this.monitoringData('SAVING');

    this.http.httpPost('/api/fn-surveyscreen2', requestData, httpOptions).subscribe((res: any) => {
      this.showLoader = false;
      this.monitoringData('SAVE-FAILED');
      if (res.status === 'SUCCESS') {
        this.monitoringData('SAVE-SUCCESS');
        if (isSaveExit) {
          this.onSaveExit(res);
        } else if (isPrev) {
          this.onSavePrev(res);
        } else if (isTimedOut) {

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
    this.router.navigate(['pages/patient-survey-one']);
  }

  onSaveTimeOut(response?: any): void {
    this.authentication.logOut();
  }

  onSaveRegSurveySuccess(response: any): void {
    this.router.navigate(['pages/injury']);
  }

  onSaveRegSurveyFailure(response: any): void {

  }

  // To navigate screen
  navigate(from) {
    if (from === 'NEXT') {
      this.monitoringData('NEXT_CLICKED');
      this.saveRegSurvey();
    } else if (from === 'PREV') {
      this.monitoringData('PREVIOUS_CLICKED');
      this.saveRegSurvey(true);
    } else if (from === 'Save') {
      this.router.navigate(['login']);
    }
  }

  // Event rises when the popup exits
  onSuccessPopup() {
    this.authentication.logOut();
    this.dialogService.changePopupRoute('login');
  }

  exitPopup() {
    this.monitoringData('EXIT-VICTOR_CLICKED');
    this.dialogService.showExitPopup(true);
  }

  saveAndReturnPopup() {
    this.monitoringData('SAVE-RETURN_CLICKED');
    this.saveRegSurvey(false, true);
  }


}
