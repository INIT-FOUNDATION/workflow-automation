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
  propertiesForm: any = {};
  delayedTime: any;

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
    }, 500);
  }

  submitForm() {
    const formData: any = [];
    const mergedFormData = {
      ...this.propertiesForm,
      ...this.data,
    };
    formData.push(mergedFormData);
    this.dialogRef.close(formData);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
