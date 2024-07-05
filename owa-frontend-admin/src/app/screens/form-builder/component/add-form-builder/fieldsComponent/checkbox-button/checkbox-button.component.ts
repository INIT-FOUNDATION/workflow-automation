import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkbox-button',
  templateUrl: './checkbox-button.component.html',
  styleUrls: ['./checkbox-button.component.scss'],
})
export class CheckboxButtonComponent implements OnInit {
  @Input() fieldData: any = {};

  labelValue: string;
  ngOnInit(): void {
    this.getInputValue();
  }

  getInputValue() {
    this.labelValue = this.fieldData.options
      .filter((element) => element.label)
      .map((element) => element.label);
  }
}
