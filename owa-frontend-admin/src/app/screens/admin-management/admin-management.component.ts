import { Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { AdminManagementService } from './services/admin-management.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  selectedIndex: number = 0;
  titleName: string = 'All Users';
  searchText = 'Search for an existing user';
  buttonText: string = 'Add New User';
  buttonRoute: string = '/admin-management/add-user';
  formType: any;
  usersData: any;
  userSearchText: string = '';
  roleSearchText: string = '';

  constructor(
    private adminService: AdminManagementService,
  ) {}
  
  ngOnInit(): void {
    // this.getAllUsersData();
  }

  ngAfterViewInit() {
    this.tabGroup.selectedIndexChange.subscribe(index => {
      this.selectedIndex = index;
      this.updateDynamicProperties();
    });    
  }

  updateDynamicProperties() {
    if (this.selectedIndex === 0) {
      this.titleName = 'All Users';
      this.searchText = 'Search for an existing user';
      this.buttonText = 'Add New User';
      this.buttonRoute = '/admin-management/add-user';
    } else {
      this.titleName = 'All Roles';
      this.searchText = 'Search for a role';
      this.buttonText = 'Add New Role';
      this.buttonRoute = '/admin-management/add-role';
    }
  }

  // searchUser(data) {
  //   if (isNaN(data)) {
  //     if (data.length > 4) {
  //       this.searchValue = data;
  //       this.getUserDetails();
  //     }
  //   } else {
  //     if (data.length > 9) {
  //       this.searchValue = data;
  //       this.getUserDetails();
  //     } else if (data.length == 0) {
  //       this.searchValue = data;
  //       this.getUserDetails();
  //     }
  //   }
  // }

  // onSearchInputChange(searchValue: string) {
  //   if (this.selectedIndex === 0) {
  //     
  //     // this.userSearchText = searchValue;
  //     // this.searchUsers();
  //   } else {if (isNaN(data)) {
  //           if (data.length > 4) {
  //             this.userSearchText = data;
  //             this.getUsersDataArray(payload);
  //           }
  //         }
  //     this.roleSearchText = searchValue;
  //     this.searchRoles();
  //   }
  // }

  // onSearchInputChange(searchValue: string) {
  //   if (this.selectedIndex === 0) {
  //     this.userSearchText = searchValue;
  //     this.searchUsers();
  //   } else {
  //     this.roleSearchText = searchValue;
  //     this.searchRoles();
  //   }
  // }

  // searchUsers() {
  //   const payload: any = {};

  //   if (isNaN(payload)) {
  //     if (payload.length > 4) {
  //       this.getAllUsersData();
  //     }
  //   } else if (payload.length == 0) {
  //     this.getAllUsersData();
  //   }
  //   console.log('Searching users with:', this.userSearchText);
  // }

  // searchRoles() {
  //   console.log('Searching roles with:', this.roleSearchText);
  // }


  // getAllUsersData() {
  //   const payload: any = {};
  //   this.getUsersDataArray(payload);
  // }

  // getUsersDataArray(payload) {
  //   this.adminService.getUsersData(payload).subscribe((res) => {
  //     this.usersData = res.data;
  //       console.log(res.data);
  //   });
  // }

  // onSearch(event: any) {
  //   const searchTerm = event.target.value;
  //   this.adminService.setSearchTerm(searchTerm);
  // }

  // onEnter(searchTerm: string) {
  //   // Emit the search term when Enter is pressed
  //   this.searchTerms.next(searchTerm);
  // }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.adminService.setSearchTerm(searchTerm);
  }
}
