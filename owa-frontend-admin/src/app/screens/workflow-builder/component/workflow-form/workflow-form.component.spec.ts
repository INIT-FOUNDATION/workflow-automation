import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFormComponent } from './workflow-form.component';

describe('WorkflowFormComponent', () => {
  let component: WorkflowFormComponent;
  let fixture: ComponentFixture<WorkflowFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowFormComponent]
    });
    fixture = TestBed.createComponent(WorkflowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
