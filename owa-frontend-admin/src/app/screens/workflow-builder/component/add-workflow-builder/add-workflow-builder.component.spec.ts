import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowBuilderComponent } from './add-workflow-builder.component';

describe('AddWorkflowBuilderComponent', () => {
  let component: AddWorkflowBuilderComponent;
  let fixture: ComponentFixture<AddWorkflowBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWorkflowBuilderComponent]
    });
    fixture = TestBed.createComponent(AddWorkflowBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
