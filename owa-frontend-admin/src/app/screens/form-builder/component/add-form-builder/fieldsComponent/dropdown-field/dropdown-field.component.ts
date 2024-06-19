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

  ngOnInit(): void {}

  deleteFormField(index) {
    this.deleteFormFieldIndex.emit(index);
  }

  editFormField(index) {
    this.editFormFieldIndex.emit(index);
  }
}
