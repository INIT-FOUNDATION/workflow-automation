import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management.component';
import { AddRoleComponent } from './component/role-management/add-role/add-role.component';
import { RoleFormComponent } from './component/role-management/role-form/role-form.component';

const routes: Routes = [
  {
    path: '',
    component: AdminManagementComponent
  },
  {
    path: 'add-role',
    component: RoleFormComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminManagementRoutingModule { }
