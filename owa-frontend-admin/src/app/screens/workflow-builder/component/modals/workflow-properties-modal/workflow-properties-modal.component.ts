import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-workflow-properties-modal',
  templateUrl: './workflow-properties-modal.component.html',
  styleUrls: ['./workflow-properties-modal.component.scss'],
})
export class WorkflowPropertiesModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<WorkflowPropertiesModalComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
