import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderFormComponent } from './form-builder-form.component';

describe('FormBuilderFormComponent', () => {
  let component: FormBuilderFormComponent;
  let fixture: ComponentFixture<FormBuilderFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormBuilderFormComponent]
    });
    fixture = TestBed.createComponent(FormBuilderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
