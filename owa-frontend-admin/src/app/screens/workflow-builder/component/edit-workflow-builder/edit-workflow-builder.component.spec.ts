import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkflowBuilderComponent } from './edit-workflow-builder.component';

describe('EditWorkflowBuilderComponent', () => {
  let component: EditWorkflowBuilderComponent;
  let fixture: ComponentFixture<EditWorkflowBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWorkflowBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditWorkflowBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
