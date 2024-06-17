import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title: string;
  @Input() badge: string;
  @Input() departments: string;
}
