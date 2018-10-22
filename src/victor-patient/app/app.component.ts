import { Component } from '@angular/core';
import { MyMonitoringService } from '../../services/monitor.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SessionService } from '../../services/session.service';
import { UserIdleService } from '../../services/user-idle.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public showTimer = false;
  public startWatchingSub: any;
  public idleResetSub: any;

  constructor(
    private myMonitoringService: MyMonitoringService,
    private router: Router,
    private authentication: AuthenticationService,
    private session: SessionService,
    private userIdle: UserIdleService) { }

  ngOnInit() {
    this.myMonitoringService.logPageView('HOME PAGE', '/');

    // To navigate the page to top
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    if (this.authentication.isLoggedIn()) {
      this.router.navigate(['pages']);
    }

  }



}
