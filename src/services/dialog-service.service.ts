import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DialogServiceService {

  popupConfig: any = {
    popupShow: true,
    popupFailureBtn: '',
    popupHeader: '',
    popupMessage: '',
    popupSuccessBtn: ''
  };

  public popupSub = new Subject<any>();

  constructor() { }

  showExitPopup(show): void {
    this.popupConfig.popupShow = show;
    this.popupConfig.popupFailureBtn = 'Cancel';
    this.popupConfig.popupSuccessBtn = 'Continue';
    this.popupConfig.popupHeader = 'Your data will be lost';
    this.popupConfig.popupMessage = 'All Entered Information will be lost. Do you want to continue?';
    this.popupSub.next(this.popupConfig);
  }

  showSaveReturnPopup(show): void {
    this.popupConfig.popupShow = show;
    this.popupConfig.popupHeader = 'Information';
    this.popupConfig.popupFailureBtn = 'Cancel';
    this.popupConfig.popupSuccessBtn = 'Continue';
    this.popupConfig.popupMessage = 'All Information Saved.  Press Continue to exit';
    this.popupSub.next(this.popupConfig);
  }

  hidePopup() {
    this.popupConfig.popupShow = false;
    this.popupConfig.route = '';
    this.popupSub.next(this.popupConfig);
  }

  changePopupRoute(routeName) {
    this.popupConfig.popupShow = false;
    this.popupConfig.route = routeName;
    if (routeName === 'login') {
      window.location.href = '/';
      return;
    }
    this.popupSub.next(this.popupConfig);
  }

  showPopup(popupConfig) {
    this.popupConfig  = popupConfig;
    this.popupSub.next(this.popupConfig);
  }

}
