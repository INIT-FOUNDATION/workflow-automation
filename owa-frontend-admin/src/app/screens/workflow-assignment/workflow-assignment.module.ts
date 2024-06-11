import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowAssignmentRoutingModule } from './workflow-assignment-routing.module';
import { AddWorkflowAssignmentComponent } from './component/add-workflow-assignment/add-workflow-assignment.component';
import { EditWorkflowAssignmentComponent } from './component/edit-workflow-assignment/edit-workflow-assignment.component';
import { FormWorkflowAssignmentComponent } from './component/form-workflow-assignment/form-workflow-assignment.component';


@NgModule({
  declarations: [
    AddWorkflowAssignmentComponent,
    EditWorkflowAssignmentComponent,
    FormWorkflowAssignmentComponent
  ],
  imports: [
    CommonModule,
    WorkflowAssignmentRoutingModule
  ]
})
export class WorkflowAssignmentModule { }
