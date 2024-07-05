import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { AddFormBuilderComponent } from './component/add-form-builder/add-form-builder.component';
import { EditFormBuilderComponent } from './component/edit-form-builder/edit-form-builder.component';
import { FormBuilderFormComponent } from './component/form-builder-form/form-builder-form.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormBuilderComponent } from './form-builder.component';
import { InputFieldComponent } from './component/add-form-builder/fieldsComponent/input-field/input-field.component';
import { TextAreaFieldComponent } from './component/add-form-builder/fieldsComponent/text-area-field/text-area-field.component';
import { RadioButtonComponent } from './component/add-form-builder/fieldsComponent/radio-button/radio-button.component';
import { CheckboxButtonComponent } from './component/add-form-builder/fieldsComponent/checkbox-button/checkbox-button.component';
import { DropdownFieldComponent } from './component/add-form-builder/fieldsComponent/dropdown-field/dropdown-field.component';
import { CreateFormNameComponent } from './component/create-form-name/create-form-name.component';
import { FormPreviewScreenComponent } from './component/form-preview-screen/form-preview-screen.component';

@NgModule({
  declarations: [
    AddFormBuilderComponent,
    EditFormBuilderComponent,
    FormBuilderFormComponent,
    FormBuilderComponent,
    InputFieldComponent,
    TextAreaFieldComponent,
    RadioButtonComponent,
    CheckboxButtonComponent,
    DropdownFieldComponent,
    CreateFormNameComponent,
    FormPreviewScreenComponent
  ],
  imports: [CommonModule, FormBuilderRoutingModule, SharedModule],
})
export class FormBuilderModule {}
