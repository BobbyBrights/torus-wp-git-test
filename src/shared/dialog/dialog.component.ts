import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DialogServiceService } from '../../services/dialog-service.service';
declare var $: any;

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
   show = false;
   header = '';
   message = '';
   successBtn = 'Yes';
   failureBtn = 'No';
   route: string;

   popupConfig: any = {};

  @Output() success: any = new EventEmitter<any>();
  @Output() failure: any = new EventEmitter<any>();


  constructor(private router: Router, private dialogService: DialogServiceService) { }

  ngOnInit() {
    this.dialogService.popupSub.subscribe((popupProp: any) => {
      if (popupProp.popupShow === true) {
        $('#appDialogModal').modal('show');
        this.popupConfig = popupProp;
      } else {
        $('#appDialogModal').modal('hide');
        if (popupProp.route && popupProp.route !== '') {
          this.router.navigate([popupProp.route]);
        }
      }
    });
  }

  ngOnChanges() {

  }

  onSuccess() {
    this.success.emit(true);
  }

  onFailure() {
    this.failure.emit(true);
    // $('#appDialogModal').modal('hide')
    // $('#appDialogModal').modal({ show: false })
  }

  // closePopup() {
  //   this.show = false;
  // }

}
