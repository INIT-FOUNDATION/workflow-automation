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
  optionLabel: string = '';
  optionValue: any = '';
  propertiesForm: any = [];
  delayedTime: any;
  createdOptions: any = [];
  generatedName: string = '';
  objectKey: any;
  minLength: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PropertiesModalComponent>,
    private formBuilderService: FormBuilderService
  ) {
    this.objectKey = Object.keys(data);
    if (data.options) {
      this.createdOptions = data.options;
    }
  }

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

  getInputFieldValues(label, value, id) {
    clearTimeout(this.delayedTime);
    this.delayedTime = setTimeout(() => {
      const fieldProperty = this.propertiesForm.find(
        (element) => element.field_property_id === id
      );
      if (!fieldProperty) {
        const currentFieldProperty = {
          field_property_id: id,
        };
        currentFieldProperty[label] = value;
        this.propertiesForm.push(currentFieldProperty);
      } else {
        fieldProperty[label] = value;
      }
      if (label == 'label') {
        this.convertToCamelCase(value);
        this.propertiesForm.name = value;
      } else if (
        label == 'minlength' &&
        this.propertiesForm.minlength > this.propertiesForm.maxlength
      ) {
        this.minLength = true;
      } else {
        this.minLength = false;
      }
    }, 500);
  }

  convertToCamelCase(value: string) {
    this.generatedName = value
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '';
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
  }

  addNewOptions() {
    this.createdOptions.push({});
  }

  getOptionValues(label: string, value: any, index: number, id: number) {
    this.optionLabel = label;
    this.optionValue = value;
    clearTimeout(this.delayedTime);

    this.delayedTime = setTimeout(() => {
      this.createdOptions[index] = {
        label,
        value,
      };

      const fieldProperty = this.propertiesForm.find(
        (element) => element.field_property_id === id
      );
      if (!fieldProperty) {
        const currentFieldProperty = {
          field_property_id: id,
          options: this.createdOptions,
        };
        this.propertiesForm.push(currentFieldProperty);
      } else {
        fieldProperty['options'] = this.createdOptions;
      }
    }, 1000);
  }

  submitForm() {
    const formData: any[] = [];
    const matchedFields = this.data.form_fields.find(
      (element) => element.field_id === this.data.field_id
    );

    matchedFields.options = this.propertiesForm;
    formData.push(this.data);
    console.log(matchedFields);
    console.log(this.data.form_fields);

    this.dialogRef.close(formData);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
