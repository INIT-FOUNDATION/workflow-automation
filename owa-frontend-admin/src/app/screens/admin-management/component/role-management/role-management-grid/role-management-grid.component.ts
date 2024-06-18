import { Component, ViewChild } from '@angular/core';
import { CommonDataTableComponent } from 'src/app/modules/common-data-table/common-data-table.component';
import { Colmodel } from 'src/app/modules/common-data-table/model/colmodel.model';

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

  ngOnInit(): void {
    this.prepareAssessmentGridCols();
  }

  prepareAssessmentGridCols() {
    this.cols = [
      new Colmodel('name', 'Name', false, false, false),
      new Colmodel('role', 'Role', false, false, false),
      new Colmodel('mobile', 'Mobile Number', false, false, false),
    ];
  }

  users = [
    {
      name: 'Ramesh Thakur',
      email: 'ramesh@gmail.com',
      role: 'Super Admin',
      mobile: '7017019019',
      image: 'path/to/image1.jpg'
    },
    {
      name: 'Kamal Kishor',
      email: 'kamal@gmail.com',
      role: 'Admin',
      mobile: '7017019019',
      image: 'path/to/image2.jpg'
    },
    {
      name: 'Nidhi Chandel',
      email: 'nidhi@gmail.com',
      role: 'Contributor',
      mobile: '7017019019',
      image: 'path/to/image3.jpg'
    },
    {
      name: 'Samarth Gupta',
      email: 'samarth@gmail.com',
      role: 'Super Admin',
      mobile: '7017019019',
      image: 'path/to/image4.jpg'
    },
    {
      name: 'Ashok Sharma',
      email: 'ashok@gmail.com',
      role: 'Super Admin',
      mobile: '7017019019',
      image: 'path/to/image5.jpg'
    }
  ];

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
}
