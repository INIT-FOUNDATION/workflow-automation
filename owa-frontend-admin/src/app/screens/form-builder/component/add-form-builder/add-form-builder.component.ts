import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { findIndex } from 'rxjs';
import { PropertiesModalComponent } from 'src/app/modules/shared/components/properties-modal/properties-modal.component';

@Component({
  selector: 'app-add-form-builder',
  templateUrl: './add-form-builder.component.html',
  styleUrls: ['./add-form-builder.component.scss'],
})
export class AddFormBuilderComponent implements OnInit {
  chooseFromArray = [
    { id: 1, acceptOnly: 'string', label: 'Name', img: 'nameIcon' },
    { id: 2, acceptOnly: 'string', label: 'Address', img: 'addressIcon' },
    { id: 3, acceptOnly: 'number', label: 'Number', img: 'numberIcon' },
    { id: 4, acceptOnly: 'number', label: 'Phone', img: 'phoneIcon' },
    { id: 5, acceptOnly: 'string', label: 'Email', img: 'emailIcon' },
    { id: 6, acceptOnly: 'date', label: 'Date', img: 'dateIcon' },
    { id: 7, acceptOnly: 'time', label: 'Time', img: 'timeIcon' },
    {
      id: 8,
      acceptOnly: 'dateTime',
      label: 'Date - Time',
      img: 'dateTimeIcon',
    },
    {
      id: 9,
      acceptOnly: 'string',
      label: 'Decision Box',
      img: 'decisionBoxIcon',
    },
    { id: 10, acceptOnly: 'dropdown', label: 'Dropdown', img: 'dropdownIcon' },
    { id: 11, acceptOnly: 'radio', label: 'Radio', img: 'radioButtonIcon' },
    { id: 12, acceptOnly: 'checkbox', label: 'Checkbox', img: 'checkboxIcon' },
    { id: 13, acceptOnly: 'url', label: 'Website', img: 'websiteIcon' },
    {
      id: 14,
      acceptOnly: 'fileUpload',
      label: 'File Upload',
      img: 'fileUploaderIcon',
    },
    {
      id: 15,
      acceptOnly: 'imgUpload',
      label: 'Image Upload',
      img: 'imageUploadIcon',
    },
    { id: 16, acceptOnly: 'section', label: 'Section', img: 'sectionIcon' },
    { id: 17, acceptOnly: 'break', label: 'Page Break', img: 'breakPageIcon' },
    { id: 18, acceptOnly: 'rating', label: 'Ratings', img: 'ratingsIcon' },
    {
      id: 19,
      acceptOnly: 'string',
      label: 'Description',
      img: 'descriptionIcon',
    },
    {
      id: 20,
      acceptOnly: 'multiline',
      label: 'Multi Line',
      img: 'multilineIcon',
    },
  ];

  chosenFields: any = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

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

    dialogRef.afterClosed().subscribe((res) => {
      this.chosenFields.some((item) => item.index === index);
      this.chosenFields[index] = res[0];
      console.log(this.chosenFields);
    });
  }
}
