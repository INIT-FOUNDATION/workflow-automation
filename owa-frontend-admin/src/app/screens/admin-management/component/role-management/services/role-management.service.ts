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
}
