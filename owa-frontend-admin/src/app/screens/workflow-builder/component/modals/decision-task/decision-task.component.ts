import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilderService } from 'src/app/screens/form-builder/services/form-builder.service';

@Component({
  selector: 'app-decision-task',
  templateUrl: './decision-task.component.html',
  styleUrls: ['./decision-task.component.scss'],
})
export class DecisionTaskComponent implements OnInit {
  @Input() node_details: any;
  @Output() getNodeDetails: EventEmitter<any> = new EventEmitter<any>();
  decisionTaskForm: FormGroup;
  formDetails: any = [];

  constructor(private formBuilderService: FormBuilderService) {}

  ngOnInit(): void {
    this.ininitForm();
    if (this.node_details.form_id) {
      this.getFormDetails();
    }
  }

  ininitForm() {
    this.decisionTaskForm = new FormGroup({
      decision_task_name: new FormControl(null, [Validators.required]),
      decision_task_description: new FormControl(null, [Validators.required]),
      operand_one: new FormControl(null, [Validators.required]),
      operator: new FormControl(null, [Validators.required]),
      operand_two: new FormControl(null, [Validators.required]),
    });
  }

  getFormDetails() {
    this.formBuilderService
      .getFormDetailsById(this.node_details?.form_id)
      .subscribe((res: any) => {
        this.formDetails = res.data.formFieldsDetails.map((field) => {
          return field.options.find((option) => option.label);
        });
      });
  }

  selectedOperand(value) {
    this.decisionTaskForm.get('operand_one').setValue(value);
  }

  submitForm() {
    const payload = this.decisionTaskForm.getRawValue();
    const formData = {
      decision_task_name: payload.decision_task_name,
      decision_task_description: payload.decision_task_description,
      conditions: [
        {
          operand_one: payload.operand_one,
          operator: payload.operator,
          operand_two: payload.operand_two,
        },
      ],
      node_id: this.node_details.node_id,
      node_type: this.node_details.node_type,
      is_new: this.node_details.is_new,
      decision_task_id: this.node_details.task_id,
    };

    this.getNodeDetails.emit(formData);
  }
}
