import { Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

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
  
  ngOnInit(): void {
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

  // getTitleName(): string {
  //   return this.tabGroup.selectedIndex === 0 ? 'All Users' : 'All Roles';
  // }

  // getSearchName(): string {
  //   return this.selectedIndex === 0 ? 'Search for an existing user' : 'Search for a role';
  // }

  // getRoute() {
  //   return this.selectedIndex === 0 ? ['/admin-management/add-user'] : ['/admin-management/add-role'];
  // }

  // getButtonText(): string {
  //   return this.selectedIndex === 0 ? 'Add New User' : 'Add New Role';
  // }


  

  // users = [
  //   {
  //     name: 'Ramesh Thakur',
  //     email: 'ramesh@gmail.com',
  //     role: 'Super Admin',
  //     mobile: '7017019019',
  //     image: 'path/to/image1.jpg'
  //   },
  //   {
  //     name: 'Kamal Kishor',
  //     email: 'kamal@gmail.com',
  //     role: 'Admin',
  //     mobile: '7017019019',
  //     image: 'path/to/image2.jpg'
  //   },
  //   {
  //     name: 'Nidhi Chandel',
  //     email: 'nidhi@gmail.com',
  //     role: 'Contributor',
  //     mobile: '7017019019',
  //     image: 'path/to/image3.jpg'
  //   },
  //   {
  //     name: 'Samarth Gupta',
  //     email: 'samarth@gmail.com',
  //     role: 'Super Admin',
  //     mobile: '7017019019',
  //     image: 'path/to/image4.jpg'
  //   },
  //   {
  //     name: 'Ashok Sharma',
  //     email: 'ashok@gmail.com',
  //     role: 'Super Admin',
  //     mobile: '7017019019',
  //     image: 'path/to/image5.jpg'
  //   }
  // ];
}
