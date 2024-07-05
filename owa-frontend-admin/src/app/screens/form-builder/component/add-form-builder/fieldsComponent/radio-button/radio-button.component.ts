import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit {
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
