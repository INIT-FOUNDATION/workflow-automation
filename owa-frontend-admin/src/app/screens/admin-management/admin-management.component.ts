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
}
