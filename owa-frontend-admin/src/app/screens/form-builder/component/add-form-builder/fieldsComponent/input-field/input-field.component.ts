import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent implements OnInit {
  @Input() fieldData: any;
  @Input() disabled: boolean = false;
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
