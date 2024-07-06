import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PropertiesModalComponent } from 'src/app/modules/shared/components/properties-modal/properties-modal.component';

@Component({
  selector: 'app-form-preview-screen',
  templateUrl: './form-preview-screen.component.html',
  styleUrls: ['./form-preview-screen.component.scss']
})
export class FormPreviewScreenComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PropertiesModalComponent>
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

}
