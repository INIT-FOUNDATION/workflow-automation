import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit {
  menu_items = [];
  isOpen = false;
  currentEndPoint: string = '/admin-management';
  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.prepareMenuItems();
    this.logCurrentUrl();
  }

  prepareMenuItems() {
    this.dataService.permissionPresent$.subscribe((res) => {
      if (res) {
        this.menu_items = res.map((value) => ({
          label: value.menu_name,
          route_url: value.route_url,
          icon: value.icon_class,
          menu_id: value.menu_id,
          permission: value.display_permission,
        }));
      }
    });
  }

  logCurrentUrl() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const endPoint = event.urlAfterRedirects;
        let count = (endPoint.match(/\//g) || []).length;
        if (count > 1) {
          this.currentEndPoint = '/' + endPoint.split('/')[1];
        } else {
          this.currentEndPoint = endPoint;
        }
      }
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
