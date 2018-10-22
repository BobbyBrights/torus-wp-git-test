import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonRepresentationComponent } from './non-representation.component';

describe('NonRepresentationComponent', () => {
  let component: NonRepresentationComponent;
  let fixture: ComponentFixture<NonRepresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonRepresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonRepresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
