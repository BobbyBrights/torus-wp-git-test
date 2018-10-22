import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() linkList: Array<any> = [];
  @Input() profilePic: any = {
    show: false,
    data: '',
    route: ''
  };
  @Output() linkClick = new EventEmitter<any>();

  private selectedLink = '';

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    this.selectedLink = this.sessionService.getSessionVar('currentPage');
  }

  ngOnChanges() {
    if (this.profilePic.show) {
      if (!this.profilePic.data && this.profilePic.data === '') {
          this.profilePic.data = './assets/images/default-profile.jpg';
       }
    }
  }

  navigate(linkName, e) {
    e.preventDefault();
    this.linkClick.emit(linkName);
  }

  onProfileClick() {
    this.router.navigate([this.profilePic.route]);
  }


}
