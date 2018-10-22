import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() showProgressBar: boolean = false;
  @Input() progressBarWidth: number = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    // if (this.progressBarWidth == 100) {
    //   this.showProgressBar = false;
    // }
  }

}
