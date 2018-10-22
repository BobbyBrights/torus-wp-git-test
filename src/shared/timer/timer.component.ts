import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs/observable/timer';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input() show = false;
  @Input() counter = 0;
  @Input() counterMsg = '';
  @Input() enableButton = true;
  @Input() buttonText = 'Continue';

  @Output() onContinue = new EventEmitter<any>();

  public counterValue = 0;

  private timerSubscription: any;

  constructor(private authentication: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.show) {
      $('#sessionTimout').modal();
      const counterInMilliSec = this.counter * 1000;
      this.counterValue = this.counter;
      this.timerSubscription = timer(1000, 1000).subscribe((val) => {
        if (this.counterValue > 0) {
          this.counterValue = --this.counterValue;
        } else {
          this.counterValue = 0;
        }
      });
    } else {

      if (this.timerSubscription) {
        this.authentication.timedOut$.next(true);
        $('#sessionTimout').modal('hide');
        this.timerSubscription.unsubscribe();
      }
    }

  }

  continue() {
    this.onContinue.emit();
  }

  close() {
    $('#sessionTimout').modal('hide');
    this.authentication.logOut();
    this.router.navigate(['login']);
    window.location.href = '/';
  }

}

