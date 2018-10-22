import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttorneyLoginAccountInfoComponent } from './attorney-login-account-info.component';

describe('AttorneyLoginAccountInfoComponent', () => {
  let component: AttorneyLoginAccountInfoComponent;
  let fixture: ComponentFixture<AttorneyLoginAccountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttorneyLoginAccountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttorneyLoginAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
