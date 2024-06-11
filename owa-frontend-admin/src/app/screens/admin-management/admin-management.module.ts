import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminManagementRoutingModule } from './admin-management-routing.module';
import { AddAdminManagementComponent } from './component/add-admin-management/add-admin-management.component';
import { EditAdminManagementComponent } from './component/edit-admin-management/edit-admin-management.component';
import { FormAdminManagementComponent } from './component/form-admin-management/form-admin-management.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  declarations: [
    AddAdminManagementComponent,
    EditAdminManagementComponent,
    FormAdminManagementComponent,
  ],
  imports: [CommonModule, AdminManagementRoutingModule, SharedModule],
})
export class AdminManagementModule {}
