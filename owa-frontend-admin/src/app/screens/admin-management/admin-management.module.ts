import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminManagementRoutingModule } from './admin-management-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AdminManagementComponent } from './admin-management.component';
import { UserManagementGridComponent } from './component/user-management/user-management-grid/user-management-grid.component';
import { RoleManagementGridComponent } from './component/role-management/role-management-grid/role-management-grid.component';
import { AddUserComponent } from './component/user-management/add-user/add-user.component';
import { EditUserComponent } from './component/user-management/edit-user/edit-user.component';
import { UserFormComponent } from './component/user-management/user-form/user-form.component';

@NgModule({
  declarations: [
    AdminManagementComponent,
    UserManagementGridComponent,
    RoleManagementGridComponent,
    AddUserComponent,
    EditUserComponent,
    UserFormComponent
  ],
  imports: [CommonModule, AdminManagementRoutingModule, SharedModule],
})
export class AdminManagementModule {}
