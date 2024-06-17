import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWorkflowAssignmentComponent } from './form-workflow-assignment.component';

describe('FormWorkflowAssignmentComponent', () => {
  let component: FormWorkflowAssignmentComponent;
  let fixture: ComponentFixture<FormWorkflowAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormWorkflowAssignmentComponent]
    });
    fixture = TestBed.createComponent(FormWorkflowAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
