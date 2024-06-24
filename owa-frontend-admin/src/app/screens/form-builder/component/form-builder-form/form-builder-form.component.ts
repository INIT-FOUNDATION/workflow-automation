import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PropertiesModalComponent } from 'src/app/modules/shared/components/properties-modal/properties-modal.component';

@Component({
  selector: 'app-form-builder-form',
  templateUrl: './form-builder-form.component.html',
  styleUrls: ['./form-builder-form.component.scss'],
})
export class FormBuilderFormComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PropertiesModalComponent>
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
}
