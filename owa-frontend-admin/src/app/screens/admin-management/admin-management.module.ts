import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminManagementRoutingModule } from './admin-management-routing.module';
import { AddAdminManagementComponent } from './component/add-admin-management/add-admin-management.component';


@NgModule({
  declarations: [AddAdminManagementComponent],
  imports: [
    CommonModule,
    AdminManagementRoutingModule
  ]
})
export class AdminManagementModule { }
