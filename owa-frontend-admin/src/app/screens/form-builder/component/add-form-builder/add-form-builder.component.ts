import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { findIndex } from 'rxjs';
import { PropertiesModalComponent } from 'src/app/modules/shared/components/properties-modal/properties-modal.component';
import { FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'app-add-form-builder',
  templateUrl: './add-form-builder.component.html',
  styleUrls: ['./add-form-builder.component.scss'],
})
export class AddFormBuilderComponent implements OnInit {
  chooseFromArray: any = [];

  chosenFields: any = [];

  constructor(
    private dialog: MatDialog,
    private formBuilderService: FormBuilderService
  ) {}

  ngOnInit(): void {
    this.getFormListData();
  }

  dropFormField(event: CdkDragDrop<any[]>) {
    const selectedItem = event.previousContainer.data[event.previousIndex];
    this.chosenFields.some((item) => item.id === selectedItem.id);
    this.chosenFields.push(selectedItem);
    this.openPropertyModal(selectedItem, this.chosenFields.length - 1);
  }

  deleteFormField(id) {
    const index = this.chosenFields.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.chosenFields.splice(index, 1);
    }
  }

  openPropertyModal(selectedItem, index) {
    const dialogRef = this.dialog.open(PropertiesModalComponent, {
      width: 'clamp(20rem, 60vw, 35rem)',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'properties-container',
      ],
      position: { right: '0px', top: '0px', bottom: '0px' },
      disableClose: true,
      data: { ...selectedItem, index },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.chosenFields.some((item) => item.index === index);
        this.chosenFields[index] = res[0];
      }
    });
  }

  getFormListData() {
    this.formBuilderService.getFormFields().subscribe((res: any) => {
      this.chooseFromArray = res.data;
    });
  }
}
