import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/Subject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { timer } from 'rxjs/observable/timer';


@Injectable()
export class UserIdleService {

  public idle$: Observable<any>;
  private timer$;
  private timeOutMilliSeconds: number;
  private idleSubscription;

  public expired$: Subject<boolean> = new Subject<boolean>();

  constructor() {

  }

  public startWatching(timeOutSeconds): Observable<any> {
    this.idle$ = merge(
      fromEvent(document, 'mosuemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'DOMMouseScroll'),
      fromEvent(document, 'mousewheel'),
      fromEvent(document, 'touchmove'),
      fromEvent(document, 'MSPointerMove'),
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'resize'),
    );

    this.timeOutMilliSeconds = timeOutSeconds * 1000;

    this.idleSubscription = this.idle$.subscribe((res) => {
   //   this.resetTimer();
    });

    this.startTimer();

    return this.expired$;
  }

  private startTimer() {
   // console.log('user idle start timer');
    this.timer$ = timer(this.timeOutMilliSeconds, this.timeOutMilliSeconds).subscribe((res) => {
      this.expired$.next(true);
      this.stopTimer();
    });
  }

  public resetTimer() {
  //  console.log('user restart start timer');
    this.timer$.unsubscribe();
    this.startTimer();
  }

  public stopTimer() {
    if(this.timer$ && this.idleSubscription) {
      this.timer$.unsubscribe();
      this.idleSubscription.unsubscribe();
    }

  }
}
