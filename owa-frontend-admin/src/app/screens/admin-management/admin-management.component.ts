import { Component, TemplateRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent {
tabData = [
    { label: 'User Management', content: 'Content 1' },
    { label: 'Role Management', content: 'Content 2' },
  ];

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

  getRoleClass(role: string) {
    switch (role) {
      case 'Super Admin':
        return 'bg-blue-500';
      case 'Admin':
        return 'bg-blue-400';
      case 'Contributor':
        return 'bg-blue-300';
      default:
        return 'bg-gray-500';
    }
  }

}
