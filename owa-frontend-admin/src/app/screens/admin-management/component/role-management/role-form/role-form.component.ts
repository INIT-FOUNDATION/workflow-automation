import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { RoleManagementService } from '../services/role-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent {
  constructor(
    private roleManagementService: RoleManagementService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  @Input() formType = 'add';
  roleForm: FormGroup;
  levelsList: any[] = [];
  menuList: any[] = [];
  levels: { label: string, value: string }[] = [];
  role_id;
  @Input() roleDetails = null;
  formSubmitted = false;


  statusList = [
    { label: 'Active', value: '1' },
    { label: 'InActive', value: '0' },
  ];


  getRoleDetails() {
    return forkJoin({
      role_details: this.roleManagementService.getRole(this.role_id),
      role_modules: this.roleManagementService
        .getCombinedAccessControlList(this.role_id)
        .toPromise(),
    });
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    if (this.formType == 'edit') {
      this.role_id = this.activeRoute.snapshot.params.role_id;
      if (!this.role_id) {
        this.router.navigate(['/admin-management']);
        return;
      }
      let roleData = await this.getRoleDetails().toPromise();
      this.roleDetails = roleData.role_details['data'];
      this.roleDetails.moduleJson = roleData.role_modules;

      this.roleForm.patchValue({
        role_name: this.roleDetails.role_name,
        level: this.roleDetails.level,
        is_active: '' + this.roleDetails.is_active,
        role_description: this.roleDetails.role_description,
      });
      if (this.roleDetails.is_active == '0') {
        this.roleForm.disable();
        this.roleForm.get('is_active').enable();
      }

      _.each(this.roleDetails.moduleJson, (menuItem) => {
        let readPermission = menuItem.read_permission == '1' ? true : false;
        let writePermission = menuItem.write_permission == '1' ? true : false;
        let disableChkbx = writePermission ? true : false;

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
        (this.roleForm.get('access_control') as FormArray).push(formGroup);
      });
    }
    this.buildFormData();
  }

  initForm() {
    this.roleForm = new FormGroup({
      role_name: new FormControl(null, [Validators.required]),
      level: new FormControl(null, [Validators.required]),
      is_active: new FormControl('1', [Validators.required]),
      role_description: new FormControl(null, [Validators.required]),
      access_control: new FormArray([]),
    });
  }

  buildFormData() {
    interface arrayData {
      data: string[];
      message: string;
    }
    forkJoin({
      levels: this.roleManagementService.getLevels(),
      menus: this.roleManagementService.getMenuList(),
    }).subscribe((data : { levels: arrayData, menus: arrayData }) => {
       
      this.levelsList = data.levels.data.map(item => ({
        label: item,
        value: item
      }));

      this.menuList = data.menus.data.map(item => ({
        label: item,
        value: item
      }));

      console.log(this.menuList)

      if (this.formType == 'add') {
        _.each(data.menus, (menuItem) => {

          let formGroup = new FormGroup({
            menu_id: new FormControl(menuItem.menu_id),
            menu_name: new FormControl(menuItem.menu_name),
            read_permission: new FormControl(false, [Validators.required]),
            write_permission: new FormControl(false, [Validators.required]),
          });
          (this.roleForm.get('access_control') as FormArray).push(formGroup);
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

  get controls() {
    return (this.roleForm.get('access_control') as FormArray).controls;
  }

  submit() {
    this.roleForm.markAllAsTouched();
    this.formSubmitted = true;
    if (!this.roleForm.valid) {
      return;
    }

    if (this.roleForm.valid) {
      let formData = this.roleForm.getRawValue();

      let access_control = formData.access_control;
      console.log(access_control)
      let permissions = [];
      _.each(access_control, (access) => {
        if (access.write_permission) {
          permissions.push({ menu_id: access.menu_id, per_id: 1 });
        }

        if (access.read_permission) {
          permissions.push({ menu_id: access.menu_id, per_id: 2 });
        }
      });
      if (permissions.length > 0) {
        formData.module_json = permissions;
      } else {
        console.log('Please choose permissions');
        return;
      }

      if (this.formType == 'add') {
        this.roleManagementService.addRole(formData).subscribe((res) => {
          console.log('Role details saved successfully');
          this.backToAdminManagement();
        });
      } else {
        formData.role_id = this.role_id;
        this.roleManagementService
          .updateRole(formData)
          .subscribe((res) => {
            console.log(
              'Role details updated successfully'
            );
            this.backToAdminManagement();
          });
      }
    }
  }

  backToAdminManagement() {
    this.router.navigate(['/admin-management']);
    return;
  }






  // async ngOnInit(): Promise<void>  {
  //   this.getLevelLists();
  //   this.getMenuLists();
  //   this.initForm();
  //   if (this.formType == 'edit') {
  //     this.role_id = this.activeRoute.snapshot.params.role_id;
  //     if (!this.role_id) {
  //       this.router.navigate(['/admin-management']);
  //       return;
  //     }

  //     try {
  //       let roleData = await this.getRoleDetails().toPromise();
        
  //       this.roleDetails = roleData.data; 
  //       console.log(this.roleDetails)
  //       this.roleForm.patchValue({
  //         role_name: this.roleDetails.role_name,
  //         level: this.roleDetails.level,
  //         is_active: this.roleDetails.is_active, 
  //         role_description: this.roleDetails.role_description,
  //       });

  //       const permissionsFormArray = this.roleForm.get('permissions') as FormArray;
  //       this.roleDetails.permissions.forEach((menuGroup, index) => {
  //         if (permissionsFormArray.at(index)) {
  //           const permissionsArray = permissionsFormArray.at(index).get('permissions') as FormArray;
  //           menuGroup.permissions.forEach((permission, j) => {
  //             permissionsArray.at(j).patchValue({
  //               value: permission.value // Assuming permission.value is boolean
  //             });
  //           });
  //         }
  //       });

  //       if (this.roleDetails.is_active === '0') {
  //         this.roleForm.disable();
  //         this.roleForm.get('is_active').enable();
  //       }
  //     } catch (error) {
  //       console.error('Error fetching role details:', error);
  //     }
  //   }
  //   else{
  //     console.log('else edit')
  //   }
  // }

  // getRoleDetails(): Observable<any> {
  //   return(this.roleManagementService.getRole(this.role_id))
  
  // }


  // getLevelLists(){
  //   this.roleManagementService.getLevels().subscribe((res: any) => {
  //     this.levelsList = res.data.map((item: string) => {
  //       return { label: item, value: item };
  //     });
  //     });
  // }

  // getMenuLists(){
  //   this.roleManagementService.getMenuList().subscribe((res: any) => {
  //     console.log(res.data)
  //     });
  // }

  // initForm() {
  //   this.roleForm = new FormGroup({
  //     role_name: new FormControl(null, [Validators.required]),
  //     role_description: new FormControl(null, [Validators.required]),
  //     level: new FormControl(null, [Validators.required]),
  //     is_active: new FormControl('1', [Validators.required]),
  //     permissions: this.fb.array([
  //       this.createMenuGroup(1),
  //       this.createMenuGroup(2),
  //       this.createMenuGroup(3) 
  //     ])
  //   });

  // }

  // createMenuGroup(menuId: number) {
  //   return this.fb.group({
  //     menu_id: [menuId],
  //     permissions: this.fb.array([
  //       this.fb.group({
  //         permission_id: [1], 
  //         value: [false]
  //       }),
  //       this.fb.group({
  //         permission_id: [2], 
  //         value: [false]
  //       })
  //     ])
  //   });
  // }

  // get permissionsArray() {
  //   return (this.roleForm.get('permissions') as FormArray).controls;
  // }

  // submit() {
  //     let formData = this.roleForm.getRawValue();
  //     formData.permissions = formData.permissions.map(menu => ({
  //       menu_id: menu.menu_id,
  //       permission_id: menu.permissions.find(p => p.value)?.permission_id 
  //     }));

  //     if (this.formType == 'add') {
  //       console.log('if')
  //       this.roleManagementService.addRole(formData).subscribe((res) => {
  //         console.log(formData)
  //         console.log(res)
  //         formData = res.data;
  //       });
  //     } else {
  //       formData.role_id = this.role_id;
  //       this.roleManagementService
  //         .updateRole(formData)
  //         .subscribe((res) => {
  //         console.log(res)
  //         });
  //     } 
  // }


  }
