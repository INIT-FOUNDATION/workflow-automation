import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdminManagementComponent } from './add-admin-management.component';

describe('AddAdminManagementComponent', () => {
  let component: AddAdminManagementComponent;
  let fixture: ComponentFixture<AddAdminManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAdminManagementComponent]
    });
    fixture = TestBed.createComponent(AddAdminManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
