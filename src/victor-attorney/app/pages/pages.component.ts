import { HttpHelperService } from './../../../services/http-helper.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserIdleService } from '../../../services/user-idle.service';
import { SessionService } from '../../../services/session.service';
import { CookieService } from 'ngx-cookie-service';
declare var $: any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
  public profilePic: any = {
    show: true,
    data: '',
    route: 'pages/login-account-info'
  };

  public showTimer = false;
  public startWatchingSub: any;
  public idleResetSub: any;
  public showLoader: boolean;

  constructor(
    private router: Router,
    public authentication: AuthenticationService,
    private userIdle: UserIdleService,
    private sessionService: SessionService,
    private cookieService: CookieService,
    private httpHelper: HttpHelperService) { }

  ngOnInit() {
    this.startTimer();
    this.getPersonalInfo();
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

    this.router.navigate(['pages/cases']);
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
onResultSuccess(response: any): void {
  this.sessionService.setSessionVar('PROFILE_INFO', response.data);
  this.profilePic.data = response.data.ProfileURL;
}

onResultFailure(response: any): void {}

}
