import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPreviewScreenComponent } from './form-preview-screen.component';

describe('FormPreviewScreenComponent', () => {
  let component: FormPreviewScreenComponent;
  let fixture: ComponentFixture<FormPreviewScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormPreviewScreenComponent]
    });
    fixture = TestBed.createComponent(FormPreviewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
