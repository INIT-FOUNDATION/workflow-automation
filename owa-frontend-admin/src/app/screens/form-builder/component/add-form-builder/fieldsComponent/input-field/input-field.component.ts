import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent implements OnInit {
  @Input() fieldData: any;
  @Input() disabled: boolean;
  @Output() deleteFormFieldIndex = new EventEmitter<number>();
  @Output() editFormFieldIndex = new EventEmitter<number>();

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
