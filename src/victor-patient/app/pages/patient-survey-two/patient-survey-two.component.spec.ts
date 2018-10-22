import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSurveyTwoComponent } from './patient-survey-two.component';

describe('PatientSurveyTwoComponent', () => {
  let component: PatientSurveyTwoComponent;
  let fixture: ComponentFixture<PatientSurveyTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSurveyTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSurveyTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
