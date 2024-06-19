import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management.component';
import { AddUserComponent } from './component/user-management/add-user/add-user.component';
import { EditUserComponent } from './component/user-management/edit-user/edit-user.component';

const routes: Routes = [
  {
    path: '',
    component: AdminManagementComponent
  },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user', component: EditUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminManagementRoutingModule { }
