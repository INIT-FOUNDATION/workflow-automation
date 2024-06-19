import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommanService } from 'src/app/modules/shared/services/comman.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any | null>;
  constructor(private http: HttpClient,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(sessionStorage.getItem('userToken'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(payload) {
    return this.http.post<any>(
      `${environment.auth_prefix_url}/admin/login`,
      payload
    );
  }

  getLoggedInUserInfo() {
    return this.http.get<any>(
      `${environment.user_prefix_url}/admin/loggedUserInfo`
    );
  }

  getMenuList(role_id) {
    return this.http.get<any>(
      `${environment.admin_prefix_url}/roles/menusList/${role_id}`
    );
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // logout() {
  //   return this.http.post<any>(
  //     `${environment.auth_prefix_url}/admin/logout`,
  //     {}
  //   );
  // }
}
