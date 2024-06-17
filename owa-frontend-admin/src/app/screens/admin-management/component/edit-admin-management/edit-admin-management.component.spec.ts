import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdminManagementComponent } from './edit-admin-management.component';

describe('EditAdminManagementComponent', () => {
  let component: EditAdminManagementComponent;
  let fixture: ComponentFixture<EditAdminManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAdminManagementComponent]
    });
    fixture = TestBed.createComponent(EditAdminManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
