import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AdminManagementService } from '../../../services/admin-management.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  @Input() formType = 'add';
  departments: any[] = [];
  roles: any[] = [];
  reports: any[] = [];
  role_id: any;
  reportingUsers: any[] = [];
  user_id: any;
  editUserInfo: any = [];

  constructor(
    public adminManagementService: AdminManagementService,
    private utilsService: UtilityService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}
  
  userForm = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email_id: new FormControl('', [Validators.required, this.customEmailValidator()]),
    dob: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$'), this.customMobileValidator]),
    role_id: new FormControl('', [Validators.required]),
    department_id: new FormControl('', [Validators.required]),
    reporting_to_users: new FormControl([]), 
    // password: new FormControl(''),
    // confirmPassword: new FormControl('')
  });

  ngOnInit(): void {
    this.getDepartmentsList();
    this.getRolesList();
    if (this.formType == 'edit') {
      this.user_id = this.activatedRoute.snapshot.params.userId;
      this.getSingleUserDetails();
    }
  }

  get titleName(): string {
    return this.formType === 'edit' ? 'Edit User' : 'Add New User';
  }

  get primaryButtonText(): string {
    return this.formType === 'edit' ? 'Update User' : 'Add User';
  }

  get secondaryButtonText(): string {
    return 'Cancel';
  }

  customMobileValidator(control: AbstractControl): ValidationErrors | null {
    const mobile = control.value;
    if (mobile && (mobile.startsWith('09') || 
                   mobile.startsWith('+') || 
                   /^[1-5]/.test(mobile))) {
      return { invalidMobileNumber: true };
    }
    return null;
  }

  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(control.value)) {
        return { 'email': true, 'invalidEmail': true };
      }
      return null;
    };
  }

  async submitUserForm() {
    if (!this.userForm.controls.first_name.valid) {
      this.utilsService.showErrorMessage('First Name must be at least 3 characters');
      return;
    }
    if (!this.userForm.controls.last_name.valid) {
      this.utilsService.showErrorMessage('Last Name must be at least 3 characters');
      return;
    }
    if (!this.userForm.controls.email_id.valid) {
      this.utilsService.showErrorMessage(this.getEmailErrorMessage());
      return;
    }
    if (!this.userForm.controls.dob.valid) {
      this.utilsService.showErrorMessage('Please mention your DOB');
      return;
    }
    if (!this.userForm.controls.gender.valid) {
      this.utilsService.showErrorMessage('Please select gender');
      return;
    }
    if (!this.userForm.controls.mobile_number.valid) {
      this.utilsService.showErrorMessage(this.getMobileErrorMessage());
      return;
    }
    if (!this.userForm.controls.role_id.valid) {
      this.utilsService.showErrorMessage('Please select role');
      return;
    }
    if (!this.userForm.controls.department_id.valid) {
      this.utilsService.showErrorMessage('Please select department');
      return;
    }
      if (this.formType != 'edit') {
        this.createUser();
        this.utilsService.showSuccessMessage(
          'User created successfully'
        );
      } else {
        this.updateUser();
        this.utilsService.showSuccessMessage('User updated successfully');
      }
}

getEmailErrorMessage() {
  const emailControl = this.userForm.controls.email_id;
  if (emailControl.hasError('required')) {
    return 'Email ID is not allowed to be empty';
  } else if (emailControl.hasError('email')) {
    return 'Invalid Email ID';
  }
  return '';
}

getMobileErrorMessage() {
  const mobileControl = this.userForm.controls.mobile_number;
  if (mobileControl.hasError('required')) {
    return 'Mobile number should be valid 10 digits';
  } else if (mobileControl.hasError('pattern')) {
    return 'Mobile number should be valid 10 digits';
  } else if (mobileControl.hasError('invalidMobileNumber')) {
    return 'Invalid mobile number';
  }
  return '';
}

async createUser() {
  let formData = this.userForm.getRawValue();
  formData.dob = moment(formData.dob).format('YYYY-MM-DD');
  await this.adminManagementService.addUser(formData).subscribe((res) => {
    this.router.navigate(['/admin-management']);
  });
}

async updateUser() {
  let formData = this.userForm.getRawValue();
  formData.dob = moment(formData.dob).format('YYYY-MM-DD');
  const response = await this.adminManagementService
    .updateUser(this.user_id, formData)
    .subscribe((res) => {
      this.router.navigate(['/admin-management']);
    });
}

async getSingleUserDetails() {
  await this.adminManagementService.getUserById(this.user_id).subscribe((res) => {
    const dob = moment(res.data?.dob, 'DD/MM/YYYY').toDate();
    this.userForm.patchValue({
      first_name: res.data?.first_name,
      last_name: res.data?.last_name,
      email_id: res.data?.email_id,
      dob: dob,
      gender: res.data?.gender,
      mobile_number: res.data?.mobile_number,
      role_id: res.data?.role_id,
      department_id: res.data?.department_id,
      reporting_to_users: res.data?.reporting_to_users,
    });

    this.getReportingList(res.data?.role_id)
    this.editUserInfo = res.data;
  });
}

getDepartmentsList() {
  this.adminManagementService.getDepartments().subscribe((response) => {
    this.departments = response.data;
  });
}

getRolesList() {
  this.adminManagementService.getRoles({is_active: true}).subscribe((res) => {
    this.roles = res.data.rolesList;
  });
}

getReportingList(roleId) {
  if (roleId) {
    this.adminManagementService.getReportingUsers(roleId, this.formType).subscribe(
      (users: any) => {
        this.reportingUsers = users.data;
        this.userForm.controls['reporting_to_users'].setValue(this.editUserInfo?.reporting_to_users || []);
      },
      error => {
        console.error('Error fetching reporting users', error);
      }
    );
  } else {
    this.reportingUsers = [];
  }
}

onRoleChange(roleId) {
  this.getReportingList(roleId)
}

cancel() {
  this.router.navigate(['/admin-management']);
}
}
