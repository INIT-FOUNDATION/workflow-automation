import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWorkflowBuilderComponent } from './form-workflow-builder.component';

describe('FormWorkflowBuilderComponent', () => {
  let component: FormWorkflowBuilderComponent;
  let fixture: ComponentFixture<FormWorkflowBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormWorkflowBuilderComponent]
    });
    fixture = TestBed.createComponent(FormWorkflowBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
