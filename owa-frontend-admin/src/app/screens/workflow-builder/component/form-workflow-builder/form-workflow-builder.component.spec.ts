import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWorkflowBuilderComponent } from './form-workflow-builder.component';

describe('FormWorkflowBuilderComponent', () => {
  let component: FormWorkflowBuilderComponent;
  let fixture: ComponentFixture<FormWorkflowBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormWorkflowBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormWorkflowBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
