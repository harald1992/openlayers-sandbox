import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjectDocumentIntoAngularComponent } from './inject-document-into-angular.component';

describe('InjectDocumentIntoAngularComponent', () => {
  let component: InjectDocumentIntoAngularComponent;
  let fixture: ComponentFixture<InjectDocumentIntoAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjectDocumentIntoAngularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InjectDocumentIntoAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
