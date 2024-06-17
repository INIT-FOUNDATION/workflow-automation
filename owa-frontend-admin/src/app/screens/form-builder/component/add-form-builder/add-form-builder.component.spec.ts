import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormBuilderComponent } from './add-form-builder.component';

describe('AddFormBuilderComponent', () => {
  let component: AddFormBuilderComponent;
  let fixture: ComponentFixture<AddFormBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFormBuilderComponent]
    });
    fixture = TestBed.createComponent(AddFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
