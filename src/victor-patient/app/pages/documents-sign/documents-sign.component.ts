/* ---------------------------------------------------------------------------
    UI Framework    : Angular
    Version         : 5.0
    Build ID        : 0
    Modified By     : Admin
    Modified Date   : 2018-Sep-22 05:30 AM
    Component Name  : Document Sign Screen

  --------------------------------------------------------------------------- */

// Imports
import { Component, OnInit } from '@angular/core';
import { MyMonitoringService } from '../../../../services/monitor.service';
import { HttpHelperService } from '../../../../services/http-helper.service';
import { Router } from '@angular/router';
import { SessionService } from '../../../../services/session.service';
import { CookieService } from 'ngx-cookie-service';
import { DialogServiceService } from '../../../../services/dialog-service.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Component Definition
@Component({
  selector: 'app-documents-sign',
  templateUrl: './documents-sign.component.html',
  styleUrls: ['./documents-sign.component.scss']
})
export class DocumentsSignComponent implements OnInit {

  // Variable Declaration
  public termsAndConditions = '';

  // properties for popup route
  public popupShow = false;
  public popupRoute = "";
  public popupHeader = "";
  public popupMessage = '';
  public popupSuccessBtn = 'Continue';
  public popupFailureBtn = 'Cancel';
  public showLoader = false;

  constructor(
    private http: HttpHelperService,
    public dialogService: DialogServiceService,
    private myMonitoringService: MyMonitoringService,
    private router: Router,
    private sessionService: SessionService,
    private cookieService: CookieService,
    private authentication: AuthenticationService) { }

  // To handle initialization of ng load
  ngOnInit() {
    this.myMonitoringService.logPageView('DOCUMENTS_SIGN_INPROGRESS', '/documentssign');
  }

  // To Unsubscribe
  ngOnDestroy(): void {
  }

  // To save, monitoring  Login details
  monitoringData(getVal): any {
    this.myMonitoringService.logEvent('DOCUMENTS_SIGN_' + getVal);
  }

  // To navigate screen
  navigate(clickedfrom) {
    if (clickedfrom === 'NEXT') {
      this.monitoringData('NEXT');
      this.router.navigate(['claimsuccess']);
    } else if (clickedfrom === 'PREV') {
      this.monitoringData('PREV');
      this.router.navigate(['pages/injury']);
    } else if (clickedfrom === 'SAVE') {
      this.monitoringData('SAVE');
      this.router.navigate(['login']);
    }
  }

    generateDocument(event) {
    // event.preventDefault();
    // this.http.httpPost('http://192.168.2.31:3000/docusign/mainprocess', {}).subscribe((res: any) => {
    //   if (res.status == 'SUCCESS') {
    //     //window.location.href = res.redirect_url;
    //     window.open(res.redirect_url, "_blank");
    //   }
    // });
    event.preventDefault();
    this.showLoader = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    const requestData = {
      data: {
        userID: this.sessionService.getSessionVar('userID') || this.cookieService.get('userID'),
        doc_ref_name: 'release_of_information',
        user_email: this.sessionService.getSessionVar('email') || this.cookieService.get('email')
      }
    };

    this.http.httpPost('/api/fn-docusign-process', requestData, httpOptions).subscribe((res: any) => {
      this.showLoader = false;
      // this.http.httpPost('https://iclaim-dev-e-us-fa-patient-001.azurewebsites.net/api/fn-docusign-process', requestData, httpOptions).subscribe((res: any) => {
      if (res.status === 'SUCCESS') {
        // window.location.href = res.redirect_url;
        window.open(res.data.redirect_url, '_self');
      }
    });
  }

  // Event rises when the popup exits
  onSuccessPopup() {
    this.authentication.logOut();
    this.dialogService.changePopupRoute('login');
  }

  exitPopup() {
    this.monitoringData('EXIT_VICTOR');
    this.dialogService.showExitPopup(true);
  }

  saveAndReturnPopup() {
    this.monitoringData('SAVE_AND_RETURN');
    this.dialogService.showSaveReturnPopup(true);
  }
}
