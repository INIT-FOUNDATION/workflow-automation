import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'app-create-form-name',
  templateUrl: './create-form-name.component.html',
  styleUrls: ['./create-form-name.component.scss'],
})
export class CreateFormNameComponent implements OnInit, AfterViewInit {
  detailsForm: FormGroup;
  fieldDetails: any;
  form_id: any;
  formTitle: string = 'Add New Form';

  constructor(
    private router: Router,
    private formBuilderService: FormBuilderService,
    private route: ActivatedRoute
  ) {
    this.form_id = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.initForm();
    if (this.form_id) {
      this.formTitle = 'Update Form';
      this.form_id = this.form_id.substring(1);
      this.getFormDetails();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.fieldDetails = JSON.parse(localStorage.getItem('formDetails'));
      if (this.fieldDetails) {
        this.detailsForm.get('form_name').setValue(this.fieldDetails.form_name);
        this.detailsForm
          .get('form_description')
          .setValue(this.fieldDetails.form_description);
      }
    }, 100);
  }

  initForm() {
    this.detailsForm = new FormGroup({
      form_name: new FormControl(null, [Validators.required]),
      form_description: new FormControl(null, [Validators.required]),
    });
  }

  getFormDetails() {
    this.formBuilderService
      .getFormDetailsById(this.form_id)
      .subscribe((res: any) => {
        this.detailsForm
          .get('form_name')
          .setValue(res?.data?.formDetails?.form_name);
        this.detailsForm
          .get('form_description')
          .setValue(res?.data?.formDetails?.form_description);
      });
  }

  submitForm() {
    if (this.detailsForm.valid) {
      const formData = this.detailsForm.getRawValue();
      localStorage.setItem('formDetails', JSON.stringify(formData));
      if (this.form_id) {
        this.router.navigate([`/form-builder/update-form/:${this.form_id}`]);
      } else {
        this.router.navigate(['/form-builder/add-form']);
      }
    }
  }
}
