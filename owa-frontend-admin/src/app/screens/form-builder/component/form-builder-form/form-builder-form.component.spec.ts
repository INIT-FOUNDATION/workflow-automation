import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderFormComponent } from './form-builder-form.component';

describe('FormBuilderFormComponent', () => {
  let component: FormBuilderFormComponent;
  let fixture: ComponentFixture<FormBuilderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBuilderFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBuilderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
