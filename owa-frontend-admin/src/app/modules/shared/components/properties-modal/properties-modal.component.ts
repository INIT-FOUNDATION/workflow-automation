import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderService } from 'src/app/screens/form-builder/services/form-builder.service';

@Component({
  selector: 'app-properties-modal',
  templateUrl: './properties-modal.component.html',
  styleUrls: ['./properties-modal.component.scss'],
})
export class PropertiesModalComponent implements OnInit {
  fieldProperties: any = [];
  propertiesFormGrp: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PropertiesModalComponent>,
    private formBuilderService: FormBuilderService
  ) {}

  ngOnInit(): void {
    this.getPropertyForFields();
    this.propertiesFormGrp = new FormGroup({
      field_properties: new FormArray([])
    });
  }

  getPropertyForFields() {
    this.formBuilderService
      .getPropertiesFormFields(this.data?.field_id)
      .subscribe((res: any) => {
        this.fieldProperties = res.data;
        const fieldPropertiesFrmArray = (this.propertiesFormGrp.get('field_properties') as FormArray);
        res.data.forEach(element => {
          let propertyFrmGrp = new FormGroup({});
          if (element.field_property_type != "jsonArray") {
            propertyFrmGrp = new FormGroup({
              field_property_id: new FormControl(element.field_property_id),
              field_property_name: new FormControl(element.field_property_name),
              field_property_label_display: new FormControl(element.field_property_label_display),
              field_property_type: new FormControl(element.field_property_type),
              options: new FormControl(element.options),
              value: new FormControl({value: null, disabled: element.field_property_name==='name'}, [Validators.required])
            });
          } else {
            propertyFrmGrp = new FormGroup({
              field_property_id: new FormControl(element.field_property_id),
              field_property_name: new FormControl(element.field_property_name),
              field_property_label_display: new FormControl(element.field_property_label_display),
              field_property_type: new FormControl(element.field_property_type),
              options: new FormControl(element.options),
              values: new FormArray([
                new FormGroup({
                  label: new FormControl(null, [Validators.required]),
                  value: new FormControl(null, [Validators.required]),
                })
              ])
            });
          }


          if (element.field_property_name === 'minlength' || element.field_property_name === 'maxlength') {
            propertyFrmGrp.get('value').addValidators([Validators.min(3)]);
          }


          fieldPropertiesFrmArray.push(propertyFrmGrp);
        });
      });
  }

  convertToCamelCase(value: string) {
    return value.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  addNewOptions(control: FormControl) {
    const optionsArray = (control.get('values') as FormArray);
    optionsArray.push(
      new FormGroup({
        label: new FormControl(null, [Validators.required]),
        value: new FormControl(null, [Validators.required]),
      })
    );
  }

  submitForm() {
    if (this.propertiesFormGrp.valid) {
      const formFields = this.propertiesFormGrp.getRawValue();
      const field_properties = formFields.field_properties;
      const propertyOptions = [];
      field_properties.forEach((property) => {
        let obj = {};
        obj['field_property_id'] = property.field_property_id;
        if (property.field_property_type === 'jsonArray') {
          obj[property.field_property_name] = property.values
        } else {
          obj[property.field_property_name] = property.value;
        }
        propertyOptions.push(obj);
      });
      
      const matchedFields = this.data.form_fields.find(
        (element) => (element.field_id === this.data.field_id && element.form_field_assoc_id === this.data.index)
      );

      matchedFields.options = propertyOptions;
      this.dialogRef.close(this.data.form_fields);
    }
  }


  get controls() {
    return (this.propertiesFormGrp.get("field_properties") as FormArray).controls;
  }

  dropDownOptionsControls(control: FormControl) {
    return (control.get("values") as FormArray).controls;
  }

  onSelect() {
    console.log(this.propertiesFormGrp.getRawValue());
  }

  onLabelChange(control: FormControl) {
    const value = control.get("value").value;
    const nameControl = this.controls.find(cntrl => cntrl.get("field_property_name").value === "name");
    const camelCaseValue = this.convertToCamelCase((value ? value : ""));
    nameControl.get("value").setValue(camelCaseValue);
  }

  onMinimumLengthChange(control: FormControl) {
    const value = control.get("value").value;
    const maxLengthControl = this.controls.find(cntrl => cntrl.get("field_property_name").value === "maxlength");
    const minmumLengthForMaxInp = value ? parseInt(value) : 3
    maxLengthControl.get("value").clearValidators();
    maxLengthControl.get("value").addValidators([Validators.required, Validators.min(minmumLengthForMaxInp)]);
    maxLengthControl.get("value").updateValueAndValidity();
  }

  closeModal() {
    this.dialogRef.close();
  }
}
