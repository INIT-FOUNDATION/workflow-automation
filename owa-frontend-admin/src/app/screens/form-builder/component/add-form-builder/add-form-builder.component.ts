import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PropertiesModalComponent } from 'src/app/modules/shared/components/properties-modal/properties-modal.component';
import { FormBuilderService } from '../../services/form-builder.service';
import { Router } from '@angular/router';
import { FormBuilderFormComponent } from '../form-builder-form/form-builder-form.component';

interface fieldObject {
  field_id: number;
  options: any[];
  form_field_assoc_id: number;
}
@Component({
  selector: 'app-add-form-builder',
  templateUrl: './add-form-builder.component.html',
  styleUrls: ['./add-form-builder.component.scss'],
})
export class AddFormBuilderComponent implements OnInit {
  chooseFromArray: any = [];
  chosenFields: fieldObject[] = [];
  indexCount: number = 0;
  enableInputs: boolean = false;
  fieldName: string = '';
  @Input() formId: number;
  constructor(
    private dialog: MatDialog,
    private formBuilderService: FormBuilderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFormListData();
  }

  dropFormField(event: CdkDragDrop<any[]>) {
    this.indexCount++;
    this.enableInputs = false;
    const selectedItem = event.previousContainer.data[event.previousIndex];
    this.chosenFields.push({
      field_id: selectedItem.field_id,
      options: [],
      form_field_assoc_id: this.indexCount,
    });
    this.openPropertyModal(selectedItem, this.indexCount);
  }

  deleteFormField(index) {
    const currentIndex = this.chosenFields.findIndex(
      (item) => item.form_field_assoc_id === index
    );
    if (currentIndex !== -1) {
      this.chosenFields.splice(currentIndex, 1);
    }
  }

  editFormField(index) {
    const selectedItem = this.chosenFields.filter(
      (item) => item.form_field_assoc_id === index
    );
    this.openPropertyModal(selectedItem[0], index);
  }

  openPropertyModal(selectedItem, index) {
    const dialogRef = this.dialog.open(PropertiesModalComponent, {
      width: 'clamp(20rem, 60vw, 25rem)',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'properties-container',
      ],
      position: { right: '0px', top: '0px', bottom: '0px' },
      disableClose: true,
      data: { ...selectedItem, index, form_fields: this.chosenFields },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.enableInputs = true;
      if (res) {
        this.chosenFields = res;
        this.chosenFields.some((item) => item.form_field_assoc_id === index);
      }
    });
  }

  getFormListData() {
    this.formBuilderService.getFormFields().subscribe((res: any) => {
      this.chooseFromArray = res.data;
    });
  }

  getInputFieldName(value) {
    this.fieldName = value;
  }

  previewScreen() {
    const dialogRef = this.dialog.open(FormBuilderFormComponent, {
      width: 'clamp(20rem, 60vw, 45rem)',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'properties-container',
      ],
      position: { right: '0px', top: '0px', bottom: '0px' },
      disableClose: true,
      data: { form_fields: this.chosenFields },
    });
  }

  submitForm() {
    const payload: any = {
      form_name: this.fieldName,
      form_description: 'Description for' + ' ' + this.fieldName,
      form_fields: this.chosenFields,
    };
    this.formBuilderService.createForm(payload).subscribe((res: any) => {
      if (res) {
        this.router.navigate(['/form-builder']);
      }
    });
  }
}
