import { Component } from '@angular/core';

@Component({
  selector: 'app-workflow-assignment',
  templateUrl: './workflow-assignment.component.html',
  styleUrls: ['./workflow-assignment.component.scss']
})
export class WorkflowAssignmentComponent {
  cardData = [
    { title: 'New Order Notification', badge: 'Payment Collection', departments: 'Sales, Accounts, Marketing' },
    { title: 'B2B Payment Collection(Cash)', badge: 'Payment Collection', departments: 'Accounts, RM & Educators' },
    { title: 'B2C Payment Collection(Online)', badge: 'Payment Collection', departments: 'Account Department' },
    { title: 'B2C Payment Collection(cash)', badge: 'Payment Collection', departments: 'Accounts Department' },
    { title: 'B2B Payment Collection(NEFT)', badge: 'Payment Collection', departments: 'Accounts Department' },
    { title: 'Pay on Collection', badge: 'Payment Collection', departments: 'Accounts, RM, Sales Agent' },
    { title: 'Performance Calculations', badge: 'Educator Payment', departments: 'Operations' },
    { title: 'Regular Classes Payment', badge: 'Educator Payment', departments: 'Operations & Accounts' },
  ];
}
