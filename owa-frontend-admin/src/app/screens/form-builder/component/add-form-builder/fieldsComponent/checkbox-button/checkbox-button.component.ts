import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox-button',
  templateUrl: './checkbox-button.component.html',
  styleUrls: ['./checkbox-button.component.scss'],
})
export class CheckboxButtonComponent {
  @Input() fieldData: any = {};
}
