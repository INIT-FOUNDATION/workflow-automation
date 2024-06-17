import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowAssignmentComponent } from './workflow-assignment.component';

describe('WorkflowAssignmentComponent', () => {
  let component: WorkflowAssignmentComponent;
  let fixture: ComponentFixture<WorkflowAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowAssignmentComponent]
    });
    fixture = TestBed.createComponent(WorkflowAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
