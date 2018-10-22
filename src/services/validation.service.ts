import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class ValidationService {

  constructor() { }

  public allowOnlyNumber(e) {
    // const pattern = /[0-9\+\-\ ]/;
    const pattern = /[0-9]/;
    this.preventKeyPress(pattern, e);
  }

  public allowOnlyString(e) {
    const pattern = /[a-zA-Z.\s]$/;
    this.preventKeyPress(pattern, e);
  }

  public preventKeyPress(pattern, e) {
    const inputChar = String.fromCharCode(e.charCode);

    if (!pattern.test(inputChar)) {
      e.preventDefault();
    }
  }

  public checkDob(dob, ageToCheck) {
    if (moment(dob).isValid()) {
      const years = moment().diff(dob, 'years');
      return (years >= ageToCheck);
    }
    return true;

  }

}
