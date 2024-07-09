import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowBuilderRoutingModule } from './workflow-builder-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { WorkflowBuilderComponent } from './workflow-builder.component';
import { AddWorkflowComponent } from './component/add-workflow/add-workflow.component';
import { EditWorkflowComponent } from './component/edit-workflow/edit-workflow.component';
import { WorkflowFormComponent } from './component/workflow-form/workflow-form.component';
import { WorkflowPropertiesModalComponent } from './component/modals/workflow-properties-modal/workflow-properties-modal.component';
import { AddTaskModalComponent } from './component/modals/add-task-modal/add-task-modal.component';
import { EmailTaskComponent } from './component/modals/email-task/email-task.component';
import { SmsTaskComponent } from './component/modals/sms-task/sms-task.component';
import { WhatsappTaskComponent } from './component/modals/whatsapp-task/whatsapp-task.component';
import { DecisionTaskComponent } from './component/modals/decision-task/decision-task.component';

@NgModule({
  declarations: [
    WorkflowBuilderComponent,
    WorkflowPropertiesModalComponent,
    AddWorkflowComponent,
    EditWorkflowComponent,
    WorkflowFormComponent,
    AddTaskModalComponent,
    EmailTaskComponent,
    SmsTaskComponent,
    WhatsappTaskComponent,
    DecisionTaskComponent
  ],
  imports: [CommonModule, WorkflowBuilderRoutingModule, SharedModule],
})
export class WorkflowBuilderModule {}
