import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowBuilderComponent } from './workflow-builder.component';
import { AddWorkflowComponent } from './component/add-workflow/add-workflow.component';
import { EditWorkflowComponent } from './component/edit-workflow/edit-workflow.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowBuilderComponent,
  },
  {
    path: 'add-workflow',
    component: AddWorkflowComponent,
  },
  {
    path: 'update-workflow/:id',
    component: EditWorkflowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowBuilderRoutingModule {}
