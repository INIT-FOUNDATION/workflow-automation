import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PropertiesModalComponent } from 'src/app/modules/shared/components/properties-modal/properties-modal.component';
import { FormBuilderService } from '../../services/form-builder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormPreviewScreenComponent } from '../form-preview-screen/form-preview-screen.component';

interface fieldObject {
  field_id: number;
  options: any[];
  form_field_assoc_id: number;
}
@Component({
  selector: 'app-form-builder-form',
  templateUrl: './form-builder-form.component.html',
  styleUrls: ['./form-builder-form.component.scss'],
})
export class FormBuilderFormComponent {
  selectedFieldsForm: FormGroup;
  chooseFromArray: any = [];
  chosenFields: fieldObject[] = [];
  indexCount: number = 0;
  enableInputs: boolean = false;
  fieldDetails: any;
  // @Input() formId: any;
  @Input() formType: string;
  formId: any;

  constructor(
    private dialog: MatDialog,
    private formBuilderService: FormBuilderService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.formId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getFormListData();
    this.initForm();
    // if (this.formType === 'edit') {
    //   this.formId = this.formId.substring(1);
    //   this.getFormDetailsById(this.formId);
    // }
  }

  ngAfterViewInit(): void {
    this.fieldDetails = JSON.parse(localStorage.getItem('formDetails'));
    this.selectedFieldsForm
      .get('form_name')
      .setValue(this.fieldDetails.form_name);
    this.selectedFieldsForm
      .get('form_description')
      .setValue(this.fieldDetails.form_description);
      if (this.formType === 'edit') {
        this.formId = this.formId.substring(1);
        this.getFormDetailsById(this.formId);
      }
  }

  initForm() {
    this.selectedFieldsForm = new FormGroup({
      form_name: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      form_description: new FormControl(null),
      form_fields: new FormControl({}),
    });
  }

  dropFormField(event: CdkDragDrop<any[]>) {
    this.indexCount++;
    this.enableInputs = false;
    const selectedItem = event.previousContainer.data[event.previousIndex];
    this.chosenFields.push({
      field_id: selectedItem.field_id,
      options: [],
      form_field_assoc_id: this.indexCount,
    });
    this.openPropertyModal(selectedItem, this.indexCount);
  }

  deleteFormField(index) {
    const currentIndex = this.chosenFields.findIndex(
      (item) => item.form_field_assoc_id === index
    );
    if (currentIndex !== -1) {
      this.chosenFields.splice(currentIndex, 1);
    }
  }

  editFormField(index) {
    const selectedItem = this.chosenFields.filter(
      (item) => item.form_field_assoc_id === index
    );
    this.openPropertyModal(selectedItem[0], index);
  }

  openPropertyModal(selectedItem, index) {
    const dialogRef = this.dialog.open(PropertiesModalComponent, {
      width: 'clamp(20rem, 60vw, 25rem)',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'properties-container',
      ],
      position: { right: '0px', top: '0px', bottom: '0px' },
      disableClose: true,
      data: { ...selectedItem, index, form_fields: this.chosenFields },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.enableInputs = true;
      if (res) {
        this.chosenFields = res;
        this.chosenFields.some((item) => item.form_field_assoc_id === index);
      }
    });
  }

  getFormListData() {
    this.formBuilderService.getFormFields().subscribe((res: any) => {
      this.chooseFromArray = res.data;
    });
  }

  getFormDetailsById(form_id: number) {
    try {
      this.formBuilderService
        .getFormDetailsById(form_id)
        .subscribe((res: any) => {
          this.enableInputs = true;
          this.chosenFields = res.data.formFieldsDetails;
        });
    } catch (error) {
      console.log(error);
    }
  }

  previewScreen() {
    const dialogRef = this.dialog.open(FormPreviewScreenComponent, {
      width: 'clamp(20rem, 60vw, 45rem)',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'properties-container',
      ],
      position: { right: '0px', top: '0px', bottom: '0px' },
      disableClose: true,
      data: { form_fields: this.chosenFields },
    });
  }

  submitForm() {
    const formData = this.selectedFieldsForm.getRawValue();
    formData.form_fields = this.chosenFields;
    this.formBuilderService.createForm(formData).subscribe((res: any) => {
      if (res) {
        this.router.navigate(['/form-builder']);
        localStorage.removeItem('formDetails');
      }
    });
  }

  updateForm() {
    const formData = this.selectedFieldsForm.getRawValue();
    formData.form_fields = this.chosenFields;
    formData.form_id = this.formId;
    this.formBuilderService.updateForm(formData).subscribe((res: any) => {
      if (res) {
        this.router.navigate(['/form-builder']);
        localStorage.removeItem('formDetails');
      }
    });
  }
}
