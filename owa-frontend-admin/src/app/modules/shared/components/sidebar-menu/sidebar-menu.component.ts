import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  animations: [
    trigger('toggleSidebar', [
      state('open', style({
        transform: 'translateX(0)'
      })),
      state('closed', style({
        transform: 'translateX(-100%)'
      })),
      transition('open <=> closed', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class SidebarMenuComponent implements OnInit {
  menu_items = [];
  isOpen = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.prepareMenuItems();
  }

  prepareMenuItems() {
    this.dataService.permissionPresent$.subscribe((res) => {
      if (res) {
        this.menu_items = res.map(value => ({
          label: value.menu_name,
          route_url: value.route_url,
          icon: value.icon_class,
          menu_id: value.menu_id,
          permission: value.display_permission,
        }));
      }
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
