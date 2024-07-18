import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowComponent } from './add-workflow.component';

describe('AddWorkflowComponent', () => {
  let component: AddWorkflowComponent;
  let fixture: ComponentFixture<AddWorkflowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWorkflowComponent]
    });
    fixture = TestBed.createComponent(AddWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
