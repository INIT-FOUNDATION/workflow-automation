import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management.component';
import { AddUserComponent } from './component/user-management/add-user/add-user.component';
import { EditUserComponent } from './component/user-management/edit-user/edit-user.component';
import { AddRoleComponent } from './component/role-management/add-role/add-role.component';
import { RoleFormComponent } from './component/role-management/role-form/role-form.component';
import { EditRoleComponent } from './component/role-management/edit-role/edit-role.component';

const routes: Routes = [
  {
    path: '',
    component: AdminManagementComponent
  },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user', component: EditUserComponent },
  {
    path: 'add-role',
    component: AddRoleComponent
  },
  {path: 'edit-role/:role_id', component: EditRoleComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminManagementRoutingModule { }
