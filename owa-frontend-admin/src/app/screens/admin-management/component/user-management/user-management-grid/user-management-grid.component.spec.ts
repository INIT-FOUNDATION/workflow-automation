import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementGridComponent } from './user-management-grid.component';

describe('UserManagementGridComponent', () => {
  let component: UserManagementGridComponent;
  let fixture: ComponentFixture<UserManagementGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserManagementGridComponent]
    });
    fixture = TestBed.createComponent(UserManagementGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
