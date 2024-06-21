import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {

  constructor(private http: HttpClient) { }

  getRolesList(postParams: any) {
    return this.http.post(`${environment.admin_prefix_url}/roles/list`, postParams);
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

  accessList(role_id) {
    return this.http.get<any>(
      `${environment.admin_prefix_url}/roles/accessList/${role_id}`
    );
  }

  getDefaultAccessList(){
    return this.http.get(`${environment.admin_prefix_url}/roles/defaultAccessList`)
  }

  getMenuListCall(){
    return this.http.get<any>(
      `${environment.admin_prefix_url}/roles/menusList`
    );
  }

}
