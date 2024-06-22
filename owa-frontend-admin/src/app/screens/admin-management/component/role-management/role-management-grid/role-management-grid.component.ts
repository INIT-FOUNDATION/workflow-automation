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
  currentPage = 1;

  constructor(
    private roleManagementService: RoleManagementService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.prepareAssessmentGridCols();
    this.getAllRolesData();
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

  getAllRolesData() {
    const payload: any = {
      page_size:
        this.adminManagementDetails && this.adminManagementDetails.rows
          ? this.adminManagementDetails.rows
          : 50,        
      current_page: this.currentPage,
    };
    this.getRolesList(payload);
  }

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

  getRolesList(payload) {
    this.roleManagementService.getRolesList(payload).subscribe((res: any) => {
   console.log(res.data)
   let reverseTheList = res.data.rolesList.reverse();
    this.adminManagementDetails.data = reverseTheList;
    this.adminManagementDetails.totalRecords = res.data.rolesCount;

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

  onPageChangeEvent(event) {
    this.currentPage = event.first == 0 ? 1 : event.first / event.rows + 1;
    this.adminManagementDetails.rows = event.rows;
    const payload = { limit: true };
    this.getAllRolesData();
  }
}
