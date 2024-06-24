import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFormBuilderComponent } from './component/add-form-builder/add-form-builder.component';
import { FormBuilderComponent } from './form-builder.component';
import { EditFormBuilderComponent } from './component/edit-form-builder/edit-form-builder.component';

const routes: Routes = [
  { path: '', component: FormBuilderComponent },
  { path: 'add-form', component: AddFormBuilderComponent },
  { path: 'update-form/:id', component: EditFormBuilderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormBuilderRoutingModule {}
