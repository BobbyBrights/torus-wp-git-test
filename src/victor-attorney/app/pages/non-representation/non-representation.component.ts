import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpHelperService } from '../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../services/monitor.service';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-non-representation',
  templateUrl: './non-representation.component.html',
  styleUrls: ['./non-representation.component.scss']
})
export class NonRepresentationComponent implements OnInit {
  public nonRepresentationForm: FormGroup;
  public showLoader: boolean;

  constructor(public router: Router,
    private fb: FormBuilder,
    private httpHelper: HttpHelperService,
    private monitorService: MyMonitoringService,
    private authentication: AuthenticationService) { }

  ngOnInit() {
    this.nonRepresentationForm = this.fb.group({
      DoNotRepresent: ['', [Validators.required]],
      CurrentlyRepresents: ['', [Validators.required]],
      CurrentlyRepresentsText: ['', [Validators.required]],
      WhoRepresents: ['', [Validators.required]],
    });
  }

}
