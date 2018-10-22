import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSuccessComponent } from './claim-success.component';

describe('ClaimSuccessComponent', () => {
  let component: ClaimSuccessComponent;
  let fixture: ComponentFixture<ClaimSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
