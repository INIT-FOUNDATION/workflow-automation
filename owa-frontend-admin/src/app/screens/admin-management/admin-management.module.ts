import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminManagementRoutingModule } from './admin-management-routing.module';
import { AdminManagementComponent } from './admin-management.component';
import { AddAdminManagementComponent } from './component/add-admin-management/add-admin-management.component';
import { EditAdminManagementComponent } from './component/edit-admin-management/edit-admin-management.component';
import { FormAdminManagementComponent } from './component/form-admin-management/form-admin-management.component';


@NgModule({
  declarations: [
    AdminManagementComponent,
    AddAdminManagementComponent,
    EditAdminManagementComponent,
    FormAdminManagementComponent
  ],
  imports: [
    CommonModule,
    AdminManagementRoutingModule
  ]
})
export class AdminManagementModule { }
