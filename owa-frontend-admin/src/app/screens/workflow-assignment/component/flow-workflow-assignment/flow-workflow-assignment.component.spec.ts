import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowWorkflowAssignmentComponent } from './flow-workflow-assignment.component';

describe('FlowWorkflowAssignmentComponent', () => {
  let component: FlowWorkflowAssignmentComponent;
  let fixture: ComponentFixture<FlowWorkflowAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowWorkflowAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlowWorkflowAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
