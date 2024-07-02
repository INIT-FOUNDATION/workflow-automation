import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-workflow-builder',
  templateUrl: './form-workflow-builder.component.html',
  styleUrls: ['./form-workflow-builder.component.scss'],
})
export class FormWorkflowBuilderComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormWorkflowBuilderComponent>
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
}
