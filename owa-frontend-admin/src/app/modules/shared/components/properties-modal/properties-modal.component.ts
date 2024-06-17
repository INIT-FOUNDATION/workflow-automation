import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-properties-modal',
  templateUrl: './properties-modal.component.html',
  styleUrls: ['./properties-modal.component.scss'],
})
export class PropertiesModalComponent implements OnInit {
  propertiesForm: FormGroup;
  fieldSize: any = [
    {
      id: 1,
      fieldName: 'Small',
    },
    {
      id: 2,
      fieldName: 'Medium',
    },
    {
      id: 3,
      fieldName: 'Large',
    },
  ];

  formatRangeList: any = [
    { id: 1, label: 'character' },
    { id: 2, label: 'number' },
    { id: 3, label: 'text' },
    { id: 4, label: 'email' },
    { id: 5, label: 'date' },
  ];
  selectedFieldId: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PropertiesModalComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.propertiesForm = new FormGroup({
      fieldLabel: new FormControl(null),
      instructionText: new FormControl(null),
      fieldSize: new FormControl(null),
      placeholderText: new FormControl(null),
      minRange: new FormControl(null),
      maxRange: new FormControl(null),
      rangeFormat: new FormControl(null),
      hideFieldLabel: new FormControl(false),
      showCharacterCount: new FormControl(false),
      mandatoryField: new FormControl(false),
      hideField: new FormControl(false),
      disabledField: new FormControl(false),
    });
  }

  selectedField(id) {
    this.selectedFieldId = id;
    this.propertiesForm.get('fieldSize').setValue(id);
  }

  selectedFormat(value) {
    this.propertiesForm.get('rangeFormat').setValue(value);
  }

  submitForm() {
    const formData: any = [];

    const mergedFormData = {
      ...this.propertiesForm.getRawValue(),
      ...this.data,
    };
    formData.push(mergedFormData);
    this.dialogRef.close(formData);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
