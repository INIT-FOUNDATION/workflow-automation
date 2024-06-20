import { Component, ViewChild } from '@angular/core';
import { CommonDataTableComponent } from 'src/app/modules/common-data-table/common-data-table.component';
import { Colmodel } from 'src/app/modules/common-data-table/model/colmodel.model';
import { AdminManagementService } from '../../../services/admin-management.service';

@Component({
  selector: 'app-user-management-grid',
  templateUrl: './user-management-grid.component.html',
  styleUrls: ['./user-management-grid.component.scss']
})
export class UserManagementGridComponent {
  @ViewChild('adminManagementDetails')
  adminManagementDetails: CommonDataTableComponent;
  cols: Colmodel[] = [];
  rowsPerPage = 5;
  currentPage = 0;

  constructor(
    private adminService: AdminManagementService,
  ) {}

  ngOnInit(): void {
    this.prepareAssessmentGridCols();
    this.getAllUsersData();
  }

  prepareAssessmentGridCols() {
    this.cols = [
      new Colmodel('display_name', 'Name', false, false, false),
      new Colmodel('role_name', 'Role', false, false, false),
      new Colmodel('mobile_number', 'Mobile Number', false, false, false),
    ];
  }

  getAllUsersData() {
    const payload: any = {
      page_size:
        this.adminManagementDetails && this.adminManagementDetails.rows
          ? this.adminManagementDetails.rows
          : 50,
      current_page: this.currentPage,
    };
    this.getUsersDataArray(payload);
  }

  getUsersDataArray(payload) {
    this.adminService.getUsersData(payload).subscribe((res) => {
      this.adminManagementDetails.data = res.data.usersList;
      this.adminManagementDetails.totalRecords = res.data.usersCount;
    });
  }
}
