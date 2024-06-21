import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {

  constructor(private http: HttpClient) { }

  getRolesList(headers: any) {
    return this.http.get(`${environment.admin_prefix_url}/roles/list`, { headers });
  }

  getRole(role_id) {
    return this.http.get(`${environment.admin_prefix_url}/roles/${role_id}`);
  }

  updateRole(data) {
    return this.http.post<any>(`${environment.admin_prefix_url}/roles/update`, data);
  }

  addRole(data) {
    return this.http.post<any>(`${environment.admin_prefix_url}/roles/add`, data);
  }

  getLevels() {
    return this.http.get(`${environment.admin_prefix_url}/roles/listLevels`);
  }

  getMenuList() {
    return this.http.get<any>(`${environment.admin_prefix_url}/roles/menusList/1`);
  }

  getCombinedAccessControlList(role_id) {
    return this.http.get<any>(
      `${environment.admin_prefix_url}/roles/accessList/${role_id}`
    );
  }

}
