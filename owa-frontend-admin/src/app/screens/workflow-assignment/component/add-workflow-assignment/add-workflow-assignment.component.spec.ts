import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowAssignmentComponent } from './add-workflow-assignment.component';

describe('AddWorkflowAssignmentComponent', () => {
  let component: AddWorkflowAssignmentComponent;
  let fixture: ComponentFixture<AddWorkflowAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkflowAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWorkflowAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
