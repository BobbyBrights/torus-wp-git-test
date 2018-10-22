import { Component, OnInit } from '@angular/core';
import { UserIdleService } from '../../../services/user-idle.service';
import { SessionService } from '../../../services/session.service';
import { MyMonitoringService } from '../../../services/monitor.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpHelperService } from '../../../services/http-helper.service';
declare var $: any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  public showTimer = false;
  public startWatchingSub: any;
  public idleResetSub: any;
  public showLoader: boolean;
  public loadingText: string;

  constructor(
    private myMonitoringService: MyMonitoringService,
    private router: Router,
    private authentication: AuthenticationService,
    private sessionService: SessionService,
    private userIdle: UserIdleService,
    private cookieService: CookieService,
    private http: HttpHelperService
  ) { }

  ngOnInit() {
    this.startTimer();

    this.authentication.loggedOut$.subscribe((isLoggedOut) => {
      if (isLoggedOut) {
        // console.log('user logged out');
        this.stopTimer();
      }
    });

    this.authentication.timedOut$.subscribe((isTimedOut) => {
      if (isTimedOut) {
        this.stopTimer();
      }
    });

   // this.getPatientInfo();
    this.router.navigate(['pages/patient-survey-one']);
  }

  getPatientInfo() {
    this.showLoader = true;
    this.loadingText = 'Loading...';
    const requestData = {
      data: {
        userId:  this.cookieService.get('userID'),
        properties: ['FirstName', 'LastName', 'LastPageName', 'streetAddress',
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

  onPatientInfoSuccess(response: any): void {
    this.sessionService.setSessionVar('patientInfo', response.data);
    const pageName = this.sessionService.getSessionVar['pages'][response.data.pageName];
    this.router.navigate([pageName]);
  }

  onPatientInfoFailure(response: any): void {

  }

  // session Timer methods
  startTimer() {
    console.log('session timer started');
    this.startWatchingSub = this.userIdle.startWatching(300).subscribe((res) => {
      // console.log('session expired');
      this.showTimer = true;
    });

    this.idleResetSub = this.userIdle.idle$.subscribe((res) => {
      this.userIdle.resetTimer();
    });
  }

  resetTimer() {
    // console.log('timer reset by continue button');
    $('#sessionTimout').modal('hide');
    this.showTimer = false;
    this.userIdle.resetTimer();
  }

  ngOnDestroy(): void {
    if (this.startWatchingSub && this.idleResetSub) {
      // console.log('unsubscribe timer event from app component');
      this.startWatchingSub.unsubscribe();
      this.idleResetSub.unsubscribe();
    }
  }

  stopTimer() {
    if (this.startWatchingSub && this.idleResetSub) {
      this.startWatchingSub.unsubscribe();
      this.idleResetSub.unsubscribe();
    }
  }

}
