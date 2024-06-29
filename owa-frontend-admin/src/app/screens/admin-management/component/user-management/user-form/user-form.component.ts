import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AdminManagementService } from '../../../services/admin-management.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
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
  statusList = [
    { label: 'Active', value: 1 },
    { label: 'InActive', value: 0 },
  ];
  formSubmitted = false;

  constructor(
    public adminManagementService: AdminManagementService,
    private utilsService: UtilityService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  userForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email_id: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/[6-9]{1}[0-9]{9}/)]),
    role_id: new FormControl('', [Validators.required]),
    department_id: new FormControl('', [Validators.required]),
    reporting_to_users: new FormControl([]),
    status: new FormControl(this.formType == 'edit' ? null : 1, [
      Validators.required,
    ]),
    // password: new FormControl(''),
    // confirmPassword: new FormControl('')
  });

  ngOnInit(): void {
    this.getDepartmentsList();
    this.getRolesList();
    if (this.formType == 'edit') {
      this.user_id = this.activatedRoute.snapshot.params.userId;
      this.getSingleUserDetails();
      this.userForm.get('mobile_number').disable();
      this.userForm.get('role_id').disable();
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
    this.formSubmitted = true;
   
    if (this.formType != 'edit') {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  async createUser() {
    let formData = this.userForm.getRawValue();
    formData.dob = moment(formData.dob).format('YYYY-MM-DD');
    await this.adminManagementService.addUser(formData).subscribe((res) => {
      this.utilsService.showSuccessMessage('User updated successfully');
      this.router.navigate(['/admin-management']);
    });
  }

  async updateUser() {
    let formData = this.userForm.getRawValue();
    formData.dob = moment(formData.dob).format('YYYY-MM-DD');
    const response = await this.adminManagementService
      .updateUser(this.user_id, formData)
      .subscribe((res) => {
        this.utilsService.showSuccessMessage('User updated successfully');
        this.router.navigate(['/admin-management']);
      });
  }

  async getSingleUserDetails() {
    await this.adminManagementService
      .getUserById(this.user_id)
      .subscribe((res) => {
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
          status: res.data?.status
            ? [1, 3, 4, 5].includes(res.data?.status)
              ? 1
              : 0
            : 0,
        });

        this.getReportingList(res.data?.role_id);
        this.editUserInfo = res.data;
      });
  }

  getDepartmentsList() {
    this.adminManagementService.getDepartments().subscribe((response) => {
      this.departments = response.data;
    });
  }

  getRolesList() {
    this.adminManagementService
      .getRoles({ is_active: true })
      .subscribe((res) => {
        this.roles = res.data.rolesList;
      });
  }

  getReportingList(roleId) {
    if (roleId) {
      this.adminManagementService
        .getReportingUsers(roleId, this.formType)
        .subscribe(
          (users: any) => {
            this.reportingUsers = users.data;
            this.userForm.controls['reporting_to_users'].setValue(
              this.editUserInfo?.reporting_to_users || []
            );
          },
          (error) => {
            console.error('Error fetching reporting users', error);
          }
        );
    } else {
      this.reportingUsers = [];
    }
  }

  onRoleChange(roleId) {
    this.getReportingList(roleId);
  }

  cancel() {
    this.router.navigate(['/admin-management']);
  }
}
