import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdminManagementComponent } from './form-admin-management.component';

describe('FormAdminManagementComponent', () => {
  let component: FormAdminManagementComponent;
  let fixture: ComponentFixture<FormAdminManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormAdminManagementComponent]
    });
    fixture = TestBed.createComponent(FormAdminManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
