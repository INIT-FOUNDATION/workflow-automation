import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowAssignmentComponent } from './workflow-assignment.component';

describe('WorkflowAssignmentComponent', () => {
  let component: WorkflowAssignmentComponent;
  let fixture: ComponentFixture<WorkflowAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkflowAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
