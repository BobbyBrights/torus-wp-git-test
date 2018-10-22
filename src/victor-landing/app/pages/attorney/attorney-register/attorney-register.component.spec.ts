import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttorneyRegisterComponent } from './attorney-register.component';

describe('AttorneyRegisterComponent', () => {
  let component: AttorneyRegisterComponent;
  let fixture: ComponentFixture<AttorneyRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttorneyRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttorneyRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
