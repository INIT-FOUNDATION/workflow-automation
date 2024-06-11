import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { AddFormBuilderComponent } from './component/add-form-builder/add-form-builder.component';
import { EditFormBuilderComponent } from './component/edit-form-builder/edit-form-builder.component';
import { FormBuilderFormComponent } from './component/form-builder-form/form-builder-form.component';


@NgModule({
  declarations: [
    AddFormBuilderComponent,
    EditFormBuilderComponent,
    FormBuilderFormComponent
  ],
  imports: [
    CommonModule,
    FormBuilderRoutingModule
  ]
})
export class FormBuilderModule { }
