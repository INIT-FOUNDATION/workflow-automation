import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-field',
  templateUrl: './dropdown-field.component.html',
  styleUrls: ['./dropdown-field.component.scss'],
})
export class DropdownFieldComponent implements OnInit {
  @Input() fieldData: any = {};
  @Output() deleteFormFieldIndex = new EventEmitter<number>();
  @Output() editFormFieldIndex = new EventEmitter<number>();

  labelValue: string;
  ngOnInit(): void {
    this.getInputValue();
  }

  getInputValue() {
    this.labelValue = this.fieldData.options
      .filter((element) => element.label)
      .map((element) => element.label);
  }

  deleteFormField(index) {
    this.deleteFormFieldIndex.emit(index);
  }

  editFormField(index) {
    this.editFormFieldIndex.emit(index);
  }
}
