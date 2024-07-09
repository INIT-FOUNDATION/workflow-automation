import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-task',
  templateUrl: './email-task.component.html',
  styleUrls: ['./email-task.component.scss'],
})
export class EmailTaskComponent implements OnInit {
  @Input() node_details: any;
  @Output() getNodeDetails: EventEmitter<any> = new EventEmitter<any>();
  emailTaskForm: FormGroup;
  constructor() {}

  ngOnInit(): void {
    this.ininitForm();
  }

  ininitForm() {
    this.emailTaskForm = new FormGroup({
      notification_task_name: new FormControl(null, [Validators.required]),
      notification_task_description: new FormControl(null, [
        Validators.required,
      ]),
      email_subject: new FormControl(null, [Validators.required]),
      email_body: new FormControl(null, [Validators.required]),
      recipient_emails: new FormControl(null, [Validators.required]),
      notification_type: new FormControl(null),
    });
  }

  submitForm() {
    const formData = {
      ...this.emailTaskForm.getRawValue(),
      node_id: this.node_details.node_id,
      node_type: this.node_details.node_type,
      is_new: this.node_details.is_new,
      task_id: this.node_details.task_id,
      notification_type: 'EMAIL',
    };

    this.getNodeDetails.emit(formData);
  }
}
