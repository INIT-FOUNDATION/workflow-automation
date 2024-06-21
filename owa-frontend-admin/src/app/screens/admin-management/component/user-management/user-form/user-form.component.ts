import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email_id: new FormControl('', [Validators.required, Validators.email]),
    dob: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
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

  async submitUserForm() {
    if (!this.userForm.controls.first_name.valid) {
      this.utilsService.showErrorMessage('First Name is not allowed to be empty');
      return;
    }
    if (!this.userForm.controls.last_name.valid) {
      this.utilsService.showErrorMessage('Last Name is not allowed to be empty');
      return;
    }
    if (!this.userForm.controls.email_id.valid) {
      this.utilsService.showErrorMessage('Email ID is not allowed to be empty');
      return;
    }
    if (!this.userForm.controls.dob.valid) {
      this.utilsService.showErrorMessage('Please mention you DOB');
      return;
    }
    if (!this.userForm.controls.gender.valid) {
      this.utilsService.showErrorMessage('Please select gender');
      return;
    }
    if (!this.userForm.controls.mobile_number.valid) {
      this.utilsService.showErrorMessage('Mobile Number is invalid');
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
      }
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
  this.adminManagementService.getRoles().subscribe((res) => {
    this.roles = res.data;
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
