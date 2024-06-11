import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkflowAssignmentComponent } from './edit-workflow-assignment.component';

describe('EditWorkflowAssignmentComponent', () => {
  let component: EditWorkflowAssignmentComponent;
  let fixture: ComponentFixture<EditWorkflowAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWorkflowAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditWorkflowAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
