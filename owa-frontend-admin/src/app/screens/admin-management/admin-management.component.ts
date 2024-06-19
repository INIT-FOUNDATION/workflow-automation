import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent {

  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.cdr.detectChanges();
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
}
