import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPropertiesModalComponent } from './workflow-properties-modal.component';

describe('WorkflowPropertiesModalComponent', () => {
  let component: WorkflowPropertiesModalComponent;
  let fixture: ComponentFixture<WorkflowPropertiesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowPropertiesModalComponent]
    });
    fixture = TestBed.createComponent(WorkflowPropertiesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
