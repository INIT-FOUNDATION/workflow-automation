import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonDataTableComponent } from 'src/app/modules/common-data-table/common-data-table.component';
import { Colmodel } from 'src/app/modules/common-data-table/model/colmodel.model';
import { AdminManagementService } from '../../../services/admin-management.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { Observable, Subject, Subscription } from 'rxjs';
import { AdminManagementComponent } from '../../../admin-management.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-management-grid',
  templateUrl: './user-management-grid.component.html',
  styleUrls: ['./user-management-grid.component.scss'],
})
export class UserManagementGridComponent implements OnInit, OnDestroy  {
  @ViewChild('adminManagementDetails')
  adminManagementDetails: CommonDataTableComponent;
  cols: Colmodel[] = [];
  rowsPerPage = 50;
  currentPage = 1;

  private keys = 'OWA@$#&*(!@%^&';
  private searchSubscription: Subscription;

  constructor(
    private adminService: AdminManagementService,
    private router: Router,
    private utilService: UtilityService,
    private adminManagementComponent: AdminManagementComponent
  ) {}

  ngOnInit(): void {
    this.prepareAssessmentGridCols();
    this.getAllUsersData();

    this.searchSubscription = this.adminService.searchObservable$.subscribe(searchTerm => {
      this.getAllUsersData(searchTerm);
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  prepareAssessmentGridCols() {
    this.cols = [
      new Colmodel('display_name', 'Name', false, false, false),
      new Colmodel('role_name', 'Role', false, false, false),
      new Colmodel('mobile_number', 'Mobile Number', false, false, false),
    ];
  }

  getAllUsersData(searchTerm: string = '') {
    const payload: any = {
      page_size:
        this.adminManagementDetails && this.adminManagementDetails.rows
          ? this.adminManagementDetails.rows
          : this.rowsPerPage,
      current_page: this.currentPage,
      search_query: searchTerm,
    };
    this.getUsersDataArray(payload);
  }

  getUsersDataArray(payload) {
    this.adminService.getUsersData(payload).subscribe((res) => {
      this.adminManagementDetails.data = res.data.usersList;
      this.adminManagementDetails.totalRecords = res.data.usersCount;
      console.log('Filtered Data:', this.adminManagementDetails.data);
    },
    (error) => {
      console.error('Failed to fetch user data', error); // Add error handling
    }
  );
  }
  
  editManagementDetails(data) {
    this.router.navigate([`/admin-management/edit-user/${data.user_id}`]);
  }

  encryptUserId(user_id: string, secretKey: string): string {
    const ciphertext = CryptoJS.AES.encrypt(user_id, secretKey).toString();
    return ciphertext;
  }

  toggleUserStatus(userId: any, currentStatus: any) {
    const secretKey = 'OWA@$#&*(!@%^&';
    const user_id_string = userId.toString();
    const encryptedUserId = this.encryptUserId(user_id_string, secretKey);
  
    const newStatus = currentStatus === 1 || currentStatus === 4 || currentStatus === 5 ? 0 : 1;
    const payload = {
      user_id: encryptedUserId,
      status: newStatus,
    };
  
    const gridData = this.adminManagementDetails.data.find(item => item.user_id === userId);
  
    Swal.fire({
      title: `Are you sure you want to change the status to ${newStatus === 0 ? 'Inactive' : 'Active'} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.updateStatus(payload).subscribe(
          (res: any) => {
            gridData.status = newStatus; // Update gridData.status based on the newStatus
            this.utilService.showSuccessMessage('User status changed successfully');
            this.getAllUsersData(); // Optionally refresh data from the server
          },
          (error) => {
            gridData.status = currentStatus;
            console.error('Failed to update status', error);
          }
        );
      } else {
        this.getAllUsersData();
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
