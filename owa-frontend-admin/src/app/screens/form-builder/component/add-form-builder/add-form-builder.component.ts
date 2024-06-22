import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { findIndex } from 'rxjs';
import { PropertiesModalComponent } from 'src/app/modules/shared/components/properties-modal/properties-modal.component';
import { FormBuilderService } from '../../services/form-builder.service';

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
  constructor(
    private dialog: MatDialog,
    private formBuilderService: FormBuilderService
  ) {}

  ngOnInit(): void {
    this.getFormListData();
  }

  dropFormField(event: CdkDragDrop<any[]>) {
    this.indexCount++;
    const selectedItem = event.previousContainer.data[event.previousIndex];
    this.chosenFields.push({
      field_id: selectedItem.field_id,
      options: [],
      form_field_assoc_id: this.indexCount,
    });
    this.openPropertyModal(selectedItem, this.indexCount);
  }

  deleteFormField(index) {
    // const currentIndex = this.chosenFields.findIndex(
    //   (item) => item.index === index
    // );
    // if (currentIndex !== -1) {
    //   this.chosenFields.splice(index, 1);
    // }
  }

  editFormField(index) {
    const selectedItem = this.chosenFields.filter(
      (item) => item.form_field_assoc_id === index
    );
    console.log(selectedItem);

    // this.openPropertyModal(selectedItem[0], index);
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
      if (res) {
        this.chosenFields.some((item) => item.form_field_assoc_id === index);
      }
    });
  }

  getFormListData() {
    this.formBuilderService.getFormFields().subscribe((res: any) => {
      this.chooseFromArray = res.data;
    });
  }

  submitForm() {}
}
