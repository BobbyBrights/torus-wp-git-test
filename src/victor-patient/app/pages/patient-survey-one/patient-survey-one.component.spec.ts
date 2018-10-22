import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSurveyOneComponent } from './patient-survey-one.component';

describe('AccDataComponent', () => {
  let component: PatientSurveyOneComponent;
  let fixture: ComponentFixture<PatientSurveyOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSurveyOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSurveyOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
