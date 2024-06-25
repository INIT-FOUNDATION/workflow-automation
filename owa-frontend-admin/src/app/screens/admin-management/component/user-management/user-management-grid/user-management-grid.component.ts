import { Component, ViewChild } from '@angular/core';
import { CommonDataTableComponent } from 'src/app/modules/common-data-table/common-data-table.component';
import { Colmodel } from 'src/app/modules/common-data-table/model/colmodel.model';
import { AdminManagementService } from '../../../services/admin-management.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-user-management-grid',
  templateUrl: './user-management-grid.component.html',
  styleUrls: ['./user-management-grid.component.scss'],
})
export class UserManagementGridComponent {
  @ViewChild('adminManagementDetails')
  adminManagementDetails: CommonDataTableComponent;
  cols: Colmodel[] = [];
  rowsPerPage = 50;
  currentPage = 1;

  private keys = 'OWA@$#&*(!@%^&';

  constructor(
    private adminService: AdminManagementService,
    private router: Router,
    private utilService: UtilityService
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

  encryptUserId(user_id: string, secretKey: string): string {
    const ciphertext = CryptoJS.AES.encrypt(user_id, secretKey).toString();
    return ciphertext;
  }

  toggleUserStatus(userId: any, currentStatus: any) {

    Swal.fire({
          title: `Are you sure you want to change the status to ${currentStatus === 1 || currentStatus === 4 || currentStatus === 5 ? 'Inactive' : 'Active'} ?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, change it!',
          cancelButtonText: 'No, keep it',
        }).then((result) => {
          if (result.isConfirmed) {
            const secretKey = 'OWA@$#&*(!@%^&'; 
            const user_id_string = userId.toString();
            const encryptedUserId = this.encryptUserId(user_id_string, secretKey);
        
            let newStatus = currentStatus === 1 || currentStatus === 4 || currentStatus === 5 ? 0 : 1;
            const payload = {
              user_id: encryptedUserId,
              status: newStatus,
            };
        
            const gridData = this.adminManagementDetails.data.find(item => item.user_id === userId);
        
            this.adminService.updateStatus(payload).subscribe(
              (res: any) => {
               
                gridData.status = newStatus === 1 ? '1' : '0';
                console.log(gridData.status);
                this.utilService.showSuccessMessage('User status changed successfully');
                this.getAllUsersData();
              },
              (error) => {
                gridData.status = currentStatus;
                console.error('Failed to update status', error);
              }
            );
          }
        });
  }

  toggleChange(event) {
    console.log(event)
    const toggle = event.source;
    if (toggle && event.value.some(item => item == toggle.value)) {
        toggle.buttonToggleGroup.value = [toggle.value];
    }
}


  onResetPassword(userId: any) {
    this.adminService.resetPasswordByAdmin(userId).subscribe(
      (response) => {
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
