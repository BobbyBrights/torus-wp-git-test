import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs/Subject';
import { SessionService } from './session.service';
import { UserIdleService } from './user-idle.service';
import { MyMonitoringService } from './monitor.service';

@Injectable()
export class AuthenticationService {
  public loggedIn$ = new Subject<any>();
  public timedOut$ = new Subject<any>();
  public loggedOut$ = new Subject<any>();


  constructor(private cookieService: CookieService, private sessionService: SessionService,
      private userIdle: UserIdleService,
      private myMonitoringService: MyMonitoringService) {
    }

  setUserID(userID: string): void {
    this.cookieService.set('userID', userID, 1, '/');
    this.sessionService.setSessionVar('userID', userID);
    this.loggedIn$.next(true);
  }

  setEmail(email: string): void {
    this.cookieService.set('email', email, 1, '/');
    this.sessionService.setSessionVar('email', email);
  }

  getUserID(): string {
    return this.cookieService.get('userID');
  }

  isLoggedIn(): boolean {
    if (this.cookieService.check('userID')) {
      this.sessionService.setSessionVar('userID', this.cookieService.get('userID'));
      return true;
    }
    return false;
  }

  logOut(): void {
    if (this.cookieService.check('userID')) {
      this.cookieService.deleteAll();
      this.userIdle.stopTimer();
      this.myMonitoringService.clearAuthentication();
      this.loggedOut$.next(true);
    }
  }

}
