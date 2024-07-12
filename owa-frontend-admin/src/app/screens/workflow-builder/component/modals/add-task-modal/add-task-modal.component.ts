import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilderService } from 'src/app/screens/form-builder/services/form-builder.service';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
})
export class AddTaskModalComponent implements OnInit {
  @Input() node_details: any;
  @Output() getNodeDetails: EventEmitter<any> = new EventEmitter<any>();
  addTaskForm: FormGroup;
  getFormDetails: any = [];

  constructor(private formBuilderService: FormBuilderService) {}

  ngOnInit(): void {
    this.initForm();
    this.getFormFieldId();
    
  }

  initForm() {
    this.addTaskForm = new FormGroup({
      task_name: new FormControl(null, [Validators.required]),
      task_description: new FormControl(null, [Validators.required]),
      form_id: new FormControl(null, [Validators.required]),
    });
  }

  getFormFieldId() {
    const payload: any = {
      page_size: 6,
      current_page: 1,
    };
    this.formBuilderService.getFormGridData(payload).subscribe((res: any) => {
      this.getFormDetails = res?.data.formsList;
    });
  }

  selectedFormId(id) {
    this.addTaskForm.get('form_id').setValue(id);
  }

  submitForm() {
    if (this.addTaskForm.valid) {
      const formData = {
        ...this.addTaskForm.getRawValue(),
        node_id: this.node_details.node_id,
        node_type: this.node_details.node_type,
        is_new: this.node_details.is_new,
        task_id: this.node_details.task_id,
        x_axis: this.node_details.x_axis.toString(),
        y_axis: this.node_details.y_axis.toString(),
      };

      this.getNodeDetails.emit(formData);
    }
  }
}
