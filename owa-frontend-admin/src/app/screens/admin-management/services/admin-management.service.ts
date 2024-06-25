import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {

  constructor(private http: HttpClient,
    private encDecService: EncDecService
  ) { }

  addUser(postParams: any): Observable<any> {
    return this.http.post(`${environment.admin_prefix_url}/users/create`, postParams);
  }

  updateUser(userId: any, postParams: any): Observable<any> {
    postParams['user_id'] = this.encDecService.set('' + userId);
    return this.http.post(`${environment.admin_prefix_url}/users/update`, postParams);
  }

  getUserById(userId): Observable<any> {
    return this.http.get(`${environment.admin_prefix_url}/users/${userId}`);
  }

  getUsersData(postParams: any): Observable<any> {
    return this.http.post(`${environment.admin_prefix_url}/users/list`, postParams);
  }

  getDepartments(): Observable<any> {
    return this.http.get(`${environment.admin_prefix_url}/departments/list`);
  }

  getRoles(postParams: any): Observable<any> {
    return this.http.post(`${environment.admin_prefix_url}/roles/list`, postParams);
  }

  getReportingUsers(roleId, type): Observable<any> {
    return this.http.get(`${environment.admin_prefix_url}/users/reportingUsers/${roleId}/${type}`);
  }

  resetPasswordByAdmin(userId: any): Observable<any> {
    return this.http.post<any>(`${environment.admin_prefix_url}/users/resetPassword/${userId}`,{});
  }

  updateStatus(postParams: any){
    return this.http.post<any>(`${environment.admin_prefix_url}/users/updateStatus`, postParams);
  }
}
