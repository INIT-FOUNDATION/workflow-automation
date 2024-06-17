import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowBuilderComponent } from './workflow-builder.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowBuilderComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowBuilderRoutingModule { }
