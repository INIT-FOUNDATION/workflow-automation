import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {

  constructor(private http: HttpClient) { }

  getUsersData(postParams: any): Observable<any> {
    return this.http.post(
      `${environment.admin_prefix_url}/users/list`,
      postParams
    );
  }
}
