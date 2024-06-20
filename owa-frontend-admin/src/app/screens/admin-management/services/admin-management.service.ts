import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {

  constructor(private http: HttpClient) { }

  addUser(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.admin_prefix_url}/users/create`,
      postParams
    );
  }

  getUsersData(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.admin_prefix_url}/users/list`,
      postParams
    );
  }

  getDepartments(): Observable<any> {
    return this.http.get(`${environment.admin_prefix_url}/departments/list`);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${environment.admin_prefix_url}/roles/list`);
  }

  // getReportingUsers(role_id): Observable<any> {
  //   return this.http.get(`${environment.admin_prefix_url}/users/reportingUsers/${role_id}`);
  // }
}
