import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management.component';
import { AddUserComponent } from './component/user-management/add-user/add-user.component';
import { EditUserComponent } from './component/user-management/edit-user/edit-user.component';
import { AddRoleComponent } from './component/role-management/add-role/add-role.component';
import { RoleFormComponent } from './component/role-management/role-form/role-form.component';

const routes: Routes = [
  {
    path: '',
    component: AdminManagementComponent
  },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user/:userId', component: EditUserComponent },
  {
    path: 'add-role',
    component: AddRoleComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminManagementRoutingModule { }
