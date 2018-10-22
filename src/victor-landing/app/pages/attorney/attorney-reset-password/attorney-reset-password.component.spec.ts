import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttorneyResetPasswordComponent } from './attorney-reset-password.component';

describe('AttorneyChangePasswordComponent', () => {
  let component: AttorneyResetPasswordComponent;
  let fixture: ComponentFixture<AttorneyResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttorneyResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttorneyResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
