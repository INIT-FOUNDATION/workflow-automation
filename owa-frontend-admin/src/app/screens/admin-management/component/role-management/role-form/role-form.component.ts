import { Component } from '@angular/core';
import {
  FormGroup
} from '@angular/forms';
import { RoleManagementService } from '../services/role-management.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent {
  constructor(
    private roleManagementService: RoleManagementService
  ) {}

  ngOnInit(): void {
    this.getLevelLists();
  }


  roleForm: FormGroup;
  levelsList: any[] = [];

  statusList = [
    { label: 'Active', value: '1' },
    { label: 'InActive', value: '0' },
  ];

  getLevelLists(){
    this.roleManagementService.getLevels().subscribe((res: any) => {
      this.levelsList = res.data.map((item: string) => {
        return { label: item, value: item };
      });
      });
  }

  }
