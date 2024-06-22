import { Component, ViewChild } from '@angular/core';
import { CommonDataTableComponent } from 'src/app/modules/common-data-table/common-data-table.component';
import { Colmodel } from 'src/app/modules/common-data-table/model/colmodel.model';
import { AdminManagementService } from '../../../services/admin-management.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management-grid',
  templateUrl: './user-management-grid.component.html',
  styleUrls: ['./user-management-grid.component.scss']
})
export class UserManagementGridComponent {
  @ViewChild('adminManagementDetails')
  adminManagementDetails: CommonDataTableComponent;
  cols: Colmodel[] = [];
  rowsPerPage = 50;
  currentPage = 1;

  constructor(
    private adminService: AdminManagementService,
    private router: Router,
    private utilService: UtilityService,
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
          : this.rowsPerPage,        
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

  editManagementDetails(data) {
    this.router.navigate([`/admin-management/edit-user/${data.user_id}`]);
  }

  deleteUserConfirmation(userId: any) {
    Swal.fire({
      title: `Are you sure you want to delete ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(userId).subscribe(
          response => {   
            console.log(response);       
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            // this.snackBar.open('User deleted successfully', 'Close', {
            //   duration: 3000,
            // });
            this.getAllUsersData();
          },
          error => {
            Swal.fire('Failed!', 'Failed to delete user.', 'error');
            // this.snackBar.open('Failed to delete user', 'Close', {
            //   duration: 3000,
            // });
          }
        );
      } 
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   Swal.fire('Cancelled');
      // }
    });
  }

  onResetPassword(userId: any) {
    this.adminService.resetPasswordByAdmin(userId).subscribe((response) => {
      this.utilService.showSuccessMessage('Password reset successfully');
      },
      (error) => {
        console.error('Error resetting password', error);
      }
    );
  }

  onPageChangeEvent(event) {
    this.currentPage = event.first == 0 ? 1 : event.first / event.rows + 1;
    this.adminManagementDetails.rows = event.rows;
    const payload = { limit: true };
    this.getAllUsersData();
  }
}
