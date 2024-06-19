import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonDataTableComponent } from 'src/app/modules/common-data-table/common-data-table.component';
import {Colmodel} from "src/app/modules/common-data-table/model/colmodel.model"

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent {

  ngOnInit(): void {
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
