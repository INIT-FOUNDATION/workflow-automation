import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
  operatorArray: any = [
    { id: 1, value: '=' },
    { id: 2, value: '!=' },
    { id: 3, value: '>' },
    { id: 4, value: '<' },
    { id: 5, value: '>=' },
    { id: 6, value: '<=' },
  ];

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
      conditions: new FormArray([this.createConditionFormGroup()]),
    });
  }

  getFormDetails() {
    this.formBuilderService
      .getFormDetailsById(this.node_details?.form_id)
      .subscribe((res: any) => {
        this.formDetails = res.data.formFieldsDetails.map((field) => {
          return field.options.find((option) => option.name);
        });
      });
  }

  selectedOperand(index: number, value: any) {
    const conditionFormGroup = this.conditionsArray.at(index) as FormGroup;
    conditionFormGroup.get('operand_one').setValue(value);
  }

  selectedOperator(index: number, value: any) {
    const conditionFormGroup = this.conditionsArray.at(index) as FormGroup;
    conditionFormGroup.get('operator').setValue(value);
  }

  addNewOptions() {
    this.conditionsArray.push(this.createConditionFormGroup());
  }

  createConditionFormGroup(): FormGroup {
    return new FormGroup({
      operand_one: new FormControl(null, [Validators.required]),
      operator: new FormControl(null, [Validators.required]),
      operand_two: new FormControl(null, [Validators.required]),
    });
  }

  get conditionsArray() {
    return this.decisionTaskForm.get('conditions') as FormArray;
  }

  submitForm() {
    const formData = {
      ...this.decisionTaskForm.getRawValue(),
      node_id: this.node_details.node_id,
      node_type: this.node_details.node_type,
      is_new: this.node_details.is_new,
      decision_task_id: this.node_details.task_id,
      x_axis: this.node_details.x_axis.toString(),
      y_axis: this.node_details.y_axis.toString(),
    };

    this.getNodeDetails.emit(formData);
  }
}
