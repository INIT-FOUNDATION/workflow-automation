import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-area-field',
  templateUrl: './text-area-field.component.html',
  styleUrls: ['./text-area-field.component.scss'],
})
export class TextAreaFieldComponent implements OnInit {
  @Input() fieldData: any = {};
  @Output() deleteFormFieldIndex = new EventEmitter<number>();
  @Output() editFormFieldIndex = new EventEmitter<number>();
  @Input() disabled: boolean;

  labelValue: string;
  placeholderValue: string;
  ngOnInit(): void {
    this.getInputValue();
    this.getPlaceholder();
  }

  getInputValue() {
    this.labelValue = this.fieldData.options
      .filter((element) => element.label)
      .map((element) => element.label);
  }

  getPlaceholder() {
    this.placeholderValue = this.fieldData.options.filter((element) => element.placeholder).map((element) => element.placeholder)
  }

  deleteFormField(index) {
    this.deleteFormFieldIndex.emit(index);
  }

  editFormField(index) {
    this.editFormFieldIndex.emit(index);
  }
}
