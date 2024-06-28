import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagementGridComponent } from './role-management-grid.component';

describe('RoleManagementGridComponent', () => {
  let component: RoleManagementGridComponent;
  let fixture: ComponentFixture<RoleManagementGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleManagementGridComponent]
    });
    fixture = TestBed.createComponent(RoleManagementGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
