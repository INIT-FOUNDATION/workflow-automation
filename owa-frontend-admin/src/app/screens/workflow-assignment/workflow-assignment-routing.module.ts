import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowAssignmentComponent } from './workflow-assignment.component';
import { AssignToComponent } from './component/assign-to/assign-to.component';

const routes: Routes = [
  {path: '', component: WorkflowAssignmentComponent},
  { path: 'assign-to', component: AssignToComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowAssignmentRoutingModule { }
