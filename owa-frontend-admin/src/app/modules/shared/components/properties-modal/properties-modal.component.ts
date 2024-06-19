import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderService } from 'src/app/screens/form-builder/services/form-builder.service';

@Component({
  selector: 'app-properties-modal',
  templateUrl: './properties-modal.component.html',
  styleUrls: ['./properties-modal.component.scss'],
})
export class PropertiesModalComponent implements OnInit {
  getPropertyFields: any = [];
  optionArray: any = [];
  propertiesForm: any = {};
  delayedTime: any;
  createdOptions: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PropertiesModalComponent>,
    private formBuilderService: FormBuilderService
  ) {}

  ngOnInit(): void {
    this.getPropertyForFields();
  }

  getPropertyForFields() {
    this.formBuilderService
      .getPropertiesFormFields(this.data?.field_id)
      .subscribe((res: any) => {
        this.getPropertyFields = res.data;
      });
  }

  getInputFieldValues(label, value) {
    clearTimeout(this.delayedTime);
    this.delayedTime = setTimeout(() => {
      this.propertiesForm[label] = value;
    }, 1000);
  }

  addNewOptions() {
    this.createdOptions.push({});
  }

  getOptionValues(value) {
    clearTimeout(this.delayedTime);

    this.delayedTime = setTimeout(() => {
      const options: any = {
        value: value,
      };
      this.optionArray.push(options);
    }, 1000);
  }

  submitForm() {
    const formData: any = [];
    let mergedFormData: any = {};
    mergedFormData = {
      ...this.data,
      options: this.optionArray,
      ...this.propertiesForm,
    };
    console.log(this.propertiesForm);
    console.log(mergedFormData);

    formData.push(mergedFormData);
    this.dialogRef.close(formData);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
