import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { MyMonitoringService } from '../../../../services/monitor.service';

import Player from '@vimeo/player';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userTypes: Array<string> = ['Patient', 'Hospital', 'Attorney', 'Admin'];
  public selectedUserType = '';
  private vimeoVideoPlayer: any;

  constructor(
    private sessionService: SessionService,
    private myMonitoringService: MyMonitoringService,
    private router: Router) { }

  ngOnInit() {
    this.myMonitoringService.logPageView('HOME_INPROGRESS', '');
  }

  ngAfterViewInit() {
    const iFrameVimeoVideo = $('#vimeoLoginVideo');
    this.vimeoVideoPlayer = new Player(iFrameVimeoVideo);

    // Tracks Played Video
    this.vimeoVideoPlayer.on('play', (data) => {
      this.myMonitoringService.logEvent('HOME_VIDEO_PLAYED', data);
    });

    // Tracks Paused Video
    this.vimeoVideoPlayer.on('pause', (data) => {
      this.myMonitoringService.logEvent('HOME_VIDEO_PAUSED', data);
    });

    // Tracks Ended Video
    this.vimeoVideoPlayer.on('ended', (data) => {
      this.myMonitoringService.logEvent('HOME_VIDEO_ENDED', data);
    });
  }

  monitoringData(getVal): any {
    this.myMonitoringService.logEvent(getVal + ' button clicked from Login Screen');
  }

  navigate(clickedfrom, e?: any) {
    if (e) {
      e.preventDefault();
    }

    if (clickedfrom === 'Patient') {
      this.router.navigate(['pages/patient-login']);
      this.myMonitoringService.logEvent('HOME_PATIENT_CLICKED');
      this.selectedUserType = clickedfrom;
      this.sessionService.setSessionVar('userType', clickedfrom.toLowerCase());
      this.sessionService.setSessionVar('currentPage', 'Patient');
    } else if (clickedfrom === 'Attorney') {
      this.router.navigate(['pages/attorney-login']);
      this.myMonitoringService.logEvent('HOME_ATTORNEY_CLICKED');
      this.selectedUserType = clickedfrom;
    }
  }

}
