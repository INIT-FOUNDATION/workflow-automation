import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-workflow-cards',
  templateUrl: './workflow-cards.component.html',
  styleUrls: ['./workflow-cards.component.scss']
})
export class WorkflowCardsComponent {
  @Input() title: string;
  @Input() badge: string;
  @Input() departments: string;
}
