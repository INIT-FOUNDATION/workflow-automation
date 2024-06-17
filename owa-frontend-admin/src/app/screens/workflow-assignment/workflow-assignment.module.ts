import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowAssignmentRoutingModule } from './workflow-assignment-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { SelectWorkflowComponent } from './component/select-workflow/select-workflow.component';
import { AssignToComponent } from './component/assign-to/assign-to.component';
import { PredefinedConditionsComponent } from './component/predefined-conditions/predefined-conditions.component';
import {MatIconModule} from '@angular/material/icon';
import { WorkflowCardsComponent } from 'src/app/modules/shared/components/workflow-cards/workflow-cards.component';
import { StepperComponent } from 'src/app/modules/shared/components/stepper/stepper.component';
import { WorkflowAssignmentComponent } from './workflow-assignment.component';

@NgModule({
  declarations: [
    WorkflowCardsComponent,
    SelectWorkflowComponent,
    StepperComponent,
    AssignToComponent,
    PredefinedConditionsComponent,
    WorkflowAssignmentComponent
  ],
  imports: [CommonModule, WorkflowAssignmentRoutingModule, SharedModule, MatIconModule],
})
export class WorkflowAssignmentModule {}
