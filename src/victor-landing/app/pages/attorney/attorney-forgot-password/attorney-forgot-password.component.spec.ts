import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttorneyForgotPasswordComponent } from './attorney-forgot-password.component';

describe('AttorneyForgotPasswordComponent', () => {
  let component: AttorneyForgotPasswordComponent;
  let fixture: ComponentFixture<AttorneyForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttorneyForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttorneyForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
