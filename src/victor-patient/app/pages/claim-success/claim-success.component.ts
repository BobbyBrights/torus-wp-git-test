/* ---------------------------------------------------------------------------
    UI Framework    : Angular
    Version         : 5.0
    Build ID        : 0
    Modified By     : Admin
    Modified Date   : 2018-Sep-26 01:30 PM
    Component Name  : Claim Success

  --------------------------------------------------------------------------- */

// Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdleService } from '../../../../services/user-idle.service';
import { AuthenticationService } from '../../../../services/authentication.service';

// Component Definition
@Component({
  selector: 'app-claim-success',
  templateUrl: './claim-success.component.html',
  styleUrls: ['./claim-success.component.scss']
})
export class ClaimSuccessComponent implements OnInit {

  constructor(
    private router: Router,
    private userIdle: UserIdleService,
    private authentication: AuthenticationService) { }


  // To handle initialization of ng load
  ngOnInit() {
    this.userIdle.stopTimer();
  }

  // navigate
  navigate() {
    this.userIdle.stopTimer();
    this.authentication.logOut();
    this.router.navigate(['login']);
  }

}
