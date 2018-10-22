import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttorneyInformationComponent } from './attorney-information.component';

describe('AttorneyInformationComponent', () => {
  let component: AttorneyInformationComponent;
  let fixture: ComponentFixture<AttorneyInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttorneyInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttorneyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
