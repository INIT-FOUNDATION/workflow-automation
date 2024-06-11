import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowBuilderRoutingModule } from './workflow-builder-routing.module';
import { AddWorkflowBuilderComponent } from './component/add-workflow-builder/add-workflow-builder.component';
import { EditWorkflowBuilderComponent } from './component/edit-workflow-builder/edit-workflow-builder.component';
import { FormWorkflowBuilderComponent } from './component/form-workflow-builder/form-workflow-builder.component';


@NgModule({
  declarations: [
    AddWorkflowBuilderComponent,
    EditWorkflowBuilderComponent,
    FormWorkflowBuilderComponent
  ],
  imports: [
    CommonModule,
    WorkflowBuilderRoutingModule
  ]
})
export class WorkflowBuilderModule { }
