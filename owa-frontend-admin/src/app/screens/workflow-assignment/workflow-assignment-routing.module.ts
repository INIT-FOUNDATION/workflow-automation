import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowAssignmentComponent } from './workflow-assignment.component';

const routes: Routes = [
  {path: '', component: WorkflowAssignmentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowAssignmentRoutingModule { }
