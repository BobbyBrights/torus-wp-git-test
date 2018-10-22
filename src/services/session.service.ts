import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
  private sessionLevel: any = {
    pages: {
      PatientDocToSign: 'pages/documentssign',
      PatientRegistrySurvey_1: 'pages/patient-survey-one',
      PatientRegistrySurvey_2: 'pages/patient-survey-two',
      PatientInjury: 'pages/injury',
    }
  };
  constructor() { }

  setSessionVar(key: string, value: any): void {
    this.sessionLevel[key] = value;
  }

  getSessionVar(key: string): any {
    return this.sessionLevel[key];
  }

  checkSessionVar(key: string): boolean {
    return (this.sessionLevel[key] !== undefined && this.sessionLevel[key] !== '');
  }
}
