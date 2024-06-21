import { Component, ViewChild } from '@angular/core';
import { CommonDataTableComponent } from 'src/app/modules/common-data-table/common-data-table.component';
import { Colmodel } from 'src/app/modules/common-data-table/model/colmodel.model';
import { RoleManagementService } from '../services/role-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-management-grid',
  templateUrl: './role-management-grid.component.html',
  styleUrls: ['./role-management-grid.component.scss']
})
export class RoleManagementGridComponent {
  @ViewChild('adminManagementDetails')
  adminManagementDetails: CommonDataTableComponent;
  cols: Colmodel[] = [];
  rowsPerPage = 10;

  constructor(
    private roleManagementService: RoleManagementService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.prepareAssessmentGridCols();
    this.getRolesList();
  }

  prepareAssessmentGridCols() {
    this.cols = [
      new Colmodel('role_name', 'Role Name', false, false, false),
      new Colmodel('role_description', 'Role Description', false, false, false),
      new Colmodel('level', 'Level', false, false, false),
      new Colmodel('status', 'Status', false, false, false),
    ];
  }

  rolesList = [];

  // getRoleClass(role: string) {
  //   switch (role) {
  //     case 'Super Admin':
  //       return 'bg-blue-500';
  //     case 'Admin':
  //       return 'bg-blue-400';
  //     case 'Contributor':
  //       return 'bg-blue-300';
  //     default:
  //       return 'bg-gray-500';
  //   }
  // }

  getRolesList() {
    const token = sessionStorage.getItem('userToken');
    const headers = { Authorization: `Bearer ${JSON.parse(token)}` };
    this.roleManagementService.getRolesList(headers).subscribe((res: any) => {
    this.rolesList = res.data;

    
    this.adminManagementDetails.data = this.rolesList;

    this.adminManagementDetails.data.forEach((item)=>{
      item.status == 1 ? item.status = 'Active' : item.status = 'Inactive'
    })
    });
  }

  addRole() {
    this.router.navigate(['/admin-management/add-role']);
  }

  editRole(gridData) {
    this.router.navigate([`/admin-management/edit-role/${gridData.role_id}`]);
  }
}
