import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { RoleManagementService } from '../services/role-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/screens/auth/services/auth.service';


@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent {
  @Input() formType = 'add';
  @Input() roleDetails = null;
  roleForm: FormGroup;
  role_id;
  statusList = [
    { label: 'Active', value: 1 },
    { label: 'InActive', value: 0 },
  ];

  levelList = [];

  constructor(
    private roleManagementService: RoleManagementService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  getRoleDetails() {
    return forkJoin({
      role_details: this.roleManagementService.getRole(this.role_id),
      role_modules: this.roleManagementService
        .accessList(this.role_id)
        .toPromise(),
    });
  }

  async ngOnInit(): Promise<void>{
    this.initForm();
 
    if (this.formType == 'edit') {
      this.role_id = this.activeRoute.snapshot.params.role_id;
      if (!this.role_id) {
        this.router.navigate(['/admin-management']);
        return;
      }
      let roleData = await this.getRoleDetails().toPromise();
      console.log(roleData)
      this.roleDetails = roleData.role_details;
      
      this.roleDetails.moduleJson = roleData.role_modules;

      this.roleForm.patchValue({
        role_name: this.roleDetails.data.role_name,
        level: this.roleDetails.data.level,
        status: '' + this.roleDetails.data.status,
        role_description: this.roleDetails.data.role_description,
      });
      if (this.roleDetails.status == '0') {
        this.roleForm.disable();
        this.roleForm.get('status').enable();
      }
      console.log(this.roleDetails)
      this.roleDetails.moduleJson.data.forEach((menuItem: any) => {
        let readPermission = menuItem.read_permission == '1' ? true : false;
        let writePermission = menuItem.write_permission == '1' ? true : false;
        let disableChkbx = writePermission ? true : false;

        console.log(menuItem.read_permission)

        let formGroup = new FormGroup({
          menu_id: new FormControl(menuItem.menu_id),
          menu_name: new FormControl(menuItem.menu_name),
          read_permission: new FormControl(
            { value: readPermission, disabled: disableChkbx },
            [Validators.required]
          ),
          write_permission: new FormControl(writePermission, [
            Validators.required,
          ]),
     
        });
   
        (this.roleForm.get('permissions') as FormArray).push(formGroup);
        console.log(formGroup)
     
      });
    }
    this.buildFormData();
  }

  initForm() {
    this.roleForm = new FormGroup({
      role_name: new FormControl(null, [Validators.required]),
      level: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      role_description: new FormControl(null, [Validators.required]),
      permissions: new FormArray([]),
    });

    console.log(this.roleForm)
  }

  buildFormData() {
    forkJoin({
      levels: this.roleManagementService.getLevels(),
      menus: this.roleManagementService.getMenuListCall(),
    }).subscribe((res: any) => {
      console.log(res.levels.data)

      _.each(res.levels.data, (level) => {
        this.levelList.push({ label: level, value: level });
      });

      if (this.formType == 'add') {
        res.menus.data.forEach((menuItem: any) => {
          console.log(menuItem)
          let formGroup = new FormGroup({
            menu_id: new FormControl(menuItem.menu_id),
            menu_name: new FormControl(menuItem.label),
            read_permission: new FormControl(false, [Validators.required]),
            write_permission: new FormControl(false, [Validators.required]),
          });

          (this.roleForm.get('permissions') as FormArray).push(formGroup);
      
        });
      }
    });
  }

  validate(control: FormGroup) {
    if (control.get('write_permission').value) {
      control.get('read_permission').setValue(true);
      control.get('read_permission').disable();
    } else {
      control.get('read_permission').enable();
    }
  }

  submit(){
    let formData = this.roleForm.getRawValue();

    let access_control = formData.permissions;
      let permissions = [];
      _.each(access_control, (access) => {
        if (access.write_permission) {
          permissions.push({ menu_id: access.menu_id, permission_id: 1 });
        }

        if (access.read_permission) {
          permissions.push({ menu_id: access.menu_id, permission_id: 2 });
        }
      });
      if (permissions.length > 0) {
        formData.permissions = permissions;
        console.log(permissions)
      } else {
        console.log('Please choose permissions');
        return;
      }


    if (this.formType == 'add') {
      this.roleManagementService.addRole(formData).subscribe((res) => {
        console.log(res)
        this.backToAdminManagement();
      });
    } else {
 
      formData.role_id = this.role_id;
      this.roleManagementService
        .updateRole(formData)
        .subscribe((res) => {
          console.log(res)
          this.backToAdminManagement();
        });
    }
  }

  backToAdminManagement() {
    this.router.navigate(['/admin-management']);
    return;
  }

  get controls() {
    return (this.roleForm.get('permissions') as FormArray).controls;
  }


 

  }
