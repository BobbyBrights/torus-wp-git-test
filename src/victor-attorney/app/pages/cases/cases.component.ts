import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHelperService } from '../../../../services/http-helper.service';
import * as moment from 'moment';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {
  public cases: Array<any>;
  public selectedCase: any;
  public openCasesVisible = true;
  public closedCasesVisible = false;
  public showLoader: boolean;
  public loaderText = 'Loading...';
  public totalCases: any;

  constructor(
    private router: Router,
    private http: HttpHelperService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.getCases();
  }

  getCases(): void {
    this.loaderText = 'Loading Cases...';
    this.showLoader = true;
    const requestData = {};
    this.http.httpPost('/api/fn-listcaseinfo', requestData, {}, true)
    .subscribe((res: any) => {
      this.showLoader = false;
      this.loaderText = 'Loading...';
      if (res.status === 'SUCCESS') {
        this.cases = res.data;
        this.totalCases = this.cases.length;
      }
    });
  }

  convertDateFormat(dateString) {
    return moment(dateString).format('MM/DD/YYYY');
  }

  hasCaseSelected(): boolean {
    if (this.selectedCase && this.selectedCase !== '') {
      return false;
    } else {
      return true;
    }
  }

  setselectedCase(value) {
    this.selectedCase = value;
    this.sessionService.setSessionVar('CASE', this.selectedCase);
  }


  navigate(pageName: string, e: any) {
    const routerPath = 'pages/';
    this.router.navigate([routerPath + pageName]);
  }

}
