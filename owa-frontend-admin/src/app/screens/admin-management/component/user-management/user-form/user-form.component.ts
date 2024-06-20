import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminManagementService } from '../../../services/admin-management.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { Router } from '@angular/router';

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

  constructor(
    public adminManagementService: AdminManagementService,
    private utilsService: UtilityService,
    public router: Router,
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
    reporting_to_users: new FormControl('', [Validators.required]),
    // password: new FormControl(''),
    // confirmPassword: new FormControl('')
  });

  ngOnInit(): void {
    this.getDepartmentsList();
    this.getRolesList();
    // this.getRepostingsList();
    // this.onRoleChange(this.role_id);
  }

  async submitUserForm() {
      if (this.formType != 'edit') {
        this.createUser();
        this.utilsService.showSuccessMessage(
          'User created successfully'
        );
      } else {
        // this.updateUser();
      }
}

async createUser() {
  let formData = this.userForm.getRawValue();
  await this.adminManagementService.addUser(formData).subscribe((res) => {
    this.router.navigate(['/admin-management']);
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

// getReportingsList() {
//   this.adminManagementService.getReportingUsers(this.role_id).subscribe((res) => {
//     this.reports = res;
//     console.log(res);
//   });
// }

// onRoleChange(role_id: any) {
//   if (role_id) {
//     this.adminManagementService.getReportingUsers(role_id).subscribe(
//       (users: any) => {
//         this.reportingUsers = users;
//         this.userForm.controls['reporting_to_users'].setValue([]);
//       },
//       error => {
//         console.error('Error fetching reporting users', error);
//       }
//     );
//   } else {
//     this.reportingUsers = [];
//   }
// }
}
