import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sms-task',
  templateUrl: './sms-task.component.html',
  styleUrls: ['./sms-task.component.scss'],
})
export class SmsTaskComponent implements OnInit {
  @Input() node_details: any;
  @Output() getNodeDetails: EventEmitter<any> = new EventEmitter<any>();
  smsTaskForm: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.smsTaskForm = new FormGroup({
      template_id: new FormControl(null, [Validators.required]),
      sms_body: new FormControl(null, [Validators.required]),
      mobile_number: new FormControl(null, [Validators.required]),
    });
  }

  submitForm() {
    if (this.smsTaskForm.valid) {
      const formData = {
        ...this.smsTaskForm.getRawValue(),
        node_id: this.node_details.node_id,
        node_type: this.node_details.node_type,
        is_new: this.node_details.is_new,
        task_id: this.node_details.task_id,
      };

      this.getNodeDetails.emit(formData);
    }
  }
}
