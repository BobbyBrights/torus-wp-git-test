import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsSignComponent } from './documents-sign.component';

describe('DocumentsSignComponent', () => {
  let component: DocumentsSignComponent;
  let fixture: ComponentFixture<DocumentsSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
