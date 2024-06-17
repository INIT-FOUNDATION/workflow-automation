import { Component } from '@angular/core';

@Component({
  selector: 'app-workflow-builder',
  templateUrl: './workflow-builder.component.html',
  styleUrls: ['./workflow-builder.component.scss']
})
export class WorkflowBuilderComponent {
  workflows = [
    { name: 'New Order Notification', type: 'Payment Collection', departments: 'Sales, Accounts, Marketing' },
    { name: 'B2B Payment Collection(Cash)', type: 'Payment Collection', departments: 'Accounts, RM & Educators' },
    { name: 'B2C Payment Collection(Online)', type: 'Payment Collection', departments: 'Accounts' },
    { name: 'B2C Payment Collection(Cheque)', type: 'Payment Collection', departments: 'Accounts' },
    { name: 'B2B Payment Collection(NEFT)', type: 'Payment Collection', departments: 'Accounts' },
    { name: 'Pay on Collection', type: 'Payment Collection', departments: 'Accounts, RM, Sales Agent' },
    { name: 'Performance Calculations', type: 'Educator Payment', departments: 'Operations' },
    { name: 'Regular Classes Payment', type: 'Educator Payment', departments: 'Operations & Accounts' },
  ];
}
