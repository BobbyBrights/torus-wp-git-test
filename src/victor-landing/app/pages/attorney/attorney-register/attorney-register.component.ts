import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { HttpHelperService } from '../../../../../services/http-helper.service';
import { MyMonitoringService } from '../../../../../services/monitor.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { ValidationService } from '../../../../../services/validation.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var $: any;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Component({
  selector: 'app-attorney-register',
  templateUrl: './attorney-register.component.html',
  styleUrls: ['./attorney-register.component.scss']
})

export class AttorneyRegisterComponent implements OnInit {
  public attorneyRegisterForm: FormGroup;
  public PrimaryAddress: FormGroup;
  public MailingAddress: FormGroup;
  public lawEnforcements: Array<any> = [
    {
      name: 'Georgia State Patrol',
      code: 'GSP'
    },
    {
      name: 'Columbus Police',
      code: 'CCP'
    },
    {
      name: 'Atlanta Police Department',
      code: 'APD'
    },
    {
      name: 'Others',
      code: 'Other'
    }
  ];

  public showAlert = false;
  public loginStatus = false;
  public message: string;
  public showLoader: boolean;
  public regStatus = false;
  public showOthersExisting: boolean;


  public countries: Array<any> = [];
  public states: Array<any> = [];
  public cities: any = {
    primaryAddress: [],
    mailingAddress: []
  };
  public selectedState: any;
  public showValidationErrors = false;
  public showDropdown = false;

  public loadingText = 'Loading...';
  public showAutoCompleteStateLoader = false;
  public showAutoCompleteCityLoader = false;
  public zipCodeError: boolean;
  public userRegData: any;

  constructor(
    public router: Router,
    public validation: ValidationService,
    private fb: FormBuilder,
    private httpHelper: HttpHelperService,
    private monitorService: MyMonitoringService,
    private authentication: AuthenticationService
  ) {




  }
  get registerFormControls(): any {
    return this.attorneyRegisterForm.controls;
  }

  get primaryAddress(): any {
    return this.attorneyRegisterForm.get('PrimaryAddress')['controls'];
  }

  get mailingAddress(): any {
    return this.attorneyRegisterForm.get('MailingAddress')['controls'];
  }

  get passwordControls(): any {
    return this.attorneyRegisterForm.get('PasswordGp')['controls'];
  }

  onItemChange(val) {
    if (this.attorneyRegisterForm.controls.LawFirm.value === 'Other') {
      this.showOthersExisting = true;
      this.attorneyRegisterForm.value.OthersLawFirm = '';
      // this.attorneyRegisterForm.controls['OthersLawFirm'].value = '';
    } else {
      this.showOthersExisting = false;
      this.attorneyRegisterForm.value.OthersLawFirm = '';
    }
  }

  ngOnInit() {
    this.createRegistrationForm();
    this.primaryAddress.State.disable();
    this.mailingAddress.State.disable();
    this.showOthersExisting = false;

    this.primaryAddress.Zip.valueChanges.subscribe(
      (zipCode: any) => {
        this.getZipInfo(zipCode, 'primaryAddress');
      });

    this.mailingAddress.Zip.valueChanges.subscribe(
      (zipCode: any) => {
        this.getZipInfo(zipCode, 'mailingAddress');
      });

      // this.registerFormControls.TelephoneDirect.valueChanges.subscribe((telephonValue) => {
      //   this.maskTelephone(telephonValue);
      // });
  }

  // To save, monitoring  Login details
  monitoringData(value: string): any {
    this.monitorService.logEvent('ATTORNEY-REGISTER_' + value);
  }

  createRegistrationForm() {
    this.attorneyRegisterForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.maxLength(15)]],
      MiddleName: ['', [Validators.maxLength(15)]],
      LastName: ['', [Validators.required, Validators.maxLength(25)]],
      Suffix: [''],
      LawFirm: ['', Validators.required],
      NameOfLawFirm: ['', [Validators.maxLength(35)]],
      EmailId: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(25)]
      ],
      TelephoneDirect: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12)
        ]
      ],
      PrimaryAddress: this.fb.group({
        Street: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(35)
          ]
        ],
        Suite: ['', Validators.required],
        City: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(25)
          ]
        ],
        State: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(2)
          ]
        ],
        Zip: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(10)
          ]
        ]
      }),
      MailingAddress: this.fb.group({
        PoBox: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(35)
          ]
        ],
        Suite: ['', Validators.required],
        City: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(25)
          ]
        ],
        State: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(2)
          ]
        ],
        Zip: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(10)
          ]
        ]
      }),
      PasswordGp: this.fb.group({
        Password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)]],
        ConfirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)]]
      }, {
        validator: this.MatchPasswords // your validation method
      }),
      profileImageName: '',
      profileImage: ''
    });
  }

  register(): void {
    this.monitoringData('REGISTER_IN');
    // this.showAlert = false;
    this.showLoader = true;
    const attorneyData = {
      attorney: this.attorneyRegisterForm.value
    };
    attorneyData.attorney.Password = this.passwordControls.Password.value;
    const requestData = {
      data: attorneyData
    };
    this.httpHelper
      .httpPost('/api/fn-attorneyregister', requestData, {}, true)
      .subscribe((res: any) => {
        this.showLoader = false;
        $('#RegisterSuccessModal').modal({ show: true });
        if (res.status === 'SUCCESS') {
          this.onRegistrationSuccess(res);
        } else {
          this.onRegistrationFailure(res);
        }
      });
  }

  onRegistrationSuccess(response?: any): void {
    this.regStatus = true;
    this.message = response.message;
    this.userRegData = {
      USERID: this.registerFormControls.EmailId.value,
      PASSWORD: this.registerFormControls.Password.value,
    };
  }

  onRegistrationFailure(response?: any): void {
    this.regStatus = false;
    this.message = response.message || 'User Registration Failed';
  }

  MatchPasswords(AC: AbstractControl) {
    const password = AC.get('Password').value;
    const confirmPassword = AC.get('ConfirmPassword').value;
    if (password !== confirmPassword) {
      console.log('false');
      AC.get('ConfirmPassword').setErrors({ MatchPassword: true });
    } else {
      // AC.get('ConfirmPassword').setErrors({ MatchPassword: false });
      return null;
    }
  }

  getZipInfo(zipCode, formGroup) {
    this.zipCodeError = false;
    if (zipCode.length === 5) {
      const requestData = {
        zipcode: zipCode
      };
      this.showLoader = true;
      this.loadingText = 'Getting State, County and Cities...';

      this.httpHelper.httpPost(`/api/fn-zipcode`, requestData, httpOptions).subscribe((res: any) => {
        console.log(res);
        this.showLoader = false;
        if (res.status === 'SUCCESS') {
          this[formGroup].State.setValue(res.data.stateData.State);
          this[formGroup].City.setValue(res.data.cityData[0].CityName);

          if (res.data.cityData.length > 1) {
            this.cities[formGroup] = res.data.cityData;
          }
        } else {
          this.zipCodeError = true;
        }
      });
    } else {
      this.cities[formGroup] = [];
    }
  }

  setState(item) {
    this.primaryAddress.State.value = item.value;
  }

  setCity(item) {
    this.primaryAddress.City.value = item.value;
  }

    // To mask telephone number
    maskTelephone(e) {
      console.log(e);
      const telePhoneOneRegex = /^[0-9]{3}$/;
      const telePhoneTwoRegex = /^[0-9]{3}([ -]?)[0-9]{3}$/;
      const telePhoneRegex = /^[0-9]{3}([ -]?)[0-9]{3}\1[0-9]{4}$/;

      if (this.registerFormControls.TelephoneDirect.value && e.which !== 8 && e.which !== 46) {
        if (telePhoneOneRegex.test(this.registerFormControls.TelephoneDirect.value)) {
          this.registerFormControls.TelephoneDirect.setValue(this.registerFormControls.TelephoneDirect.value + '-');

        } else if (telePhoneTwoRegex.test(this.registerFormControls.TelephoneDirect.value)) {
          this.registerFormControls.TelephoneDirect.setValue(this.registerFormControls.TelephoneDirect.value + '-');
        }
      }

    }
}
