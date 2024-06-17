import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-workflow-cards',
  templateUrl: './workflow-cards.component.html',
  styleUrls: ['./workflow-cards.component.scss'],
})
export class WorkflowCardsComponent implements OnInit {
  @Input() data: any;

  ngOnInit(): void {}
}
