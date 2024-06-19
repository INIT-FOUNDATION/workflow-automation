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
  departments: any = [];

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
    // password: new FormControl(''),
    // confirmPassword: new FormControl('')
  });

  ngOnInit(): void {

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

// async getDepartmentsList() {
//   this.departments = await this.adminManagementService.getDepartments().toPromise();
//   console.log(this.departments);
// }

// getDepartmentsList() {
//   this.adminManagementService.getDepartments().subscribe((data) => {
//     this.departments = data;
//     console.log(data);
//   });
// }
}
