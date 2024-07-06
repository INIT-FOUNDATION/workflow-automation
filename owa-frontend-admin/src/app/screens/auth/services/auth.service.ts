import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommanService } from 'src/app/modules/shared/services/comman.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { AppPreferencesService } from 'src/app/modules/shared/services/preferences.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentendPoint;
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any | null>;
  constructor(private http: HttpClient, 
    private router: Router,
    private dataService: DataService,
    private appPreferences: AppPreferencesService) {
    this.currentUserSubject = new BehaviorSubject<any>(
      appPreferences.getValue('userToken') ? JSON.parse(appPreferences.getValue('userToken')) : false
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
      `${environment.admin_prefix_url}/roles/accessList/${role_id}`
    );
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  redirectAsperPermission() {
    this.dataService.permissionPresent$.subscribe((res) => {
      if (res) {
       const firstmenu = res.find(e => e.display_permission === 1)
       this.router.navigate([`/${firstmenu.route_url}`]);
      }
    });
  }

  getForgotPasswordOtp(payload){
    return this.http.post<any>(
      `${environment.auth_prefix_url}/admin/getForgetPasswordOtp`,
      payload
    ); 
  }

  verifyForgotPasswordOtp(payload){
    return this.http.post<any>(
      `${environment.auth_prefix_url}/admin/verifyForgetPasswordOtp`,
      payload
    ); 
  }

  generateOtp(payload){
    return this.http.post<any>(
      `${environment.auth_prefix_url}/user/generateOTP`,
      payload
    );
  }

  resetForgotPassword(payload){
    return this.http.post<any>(
      `${environment.auth_prefix_url}/admin/resetForgetPassword`,
      payload
    ); 
  }

  validateOtp(payload){
    return this.http.post<any>(
      `${environment.auth_prefix_url}/user/validateOTP`,
      payload
    ); 
  }

  logout() {
    if (this.appPreferences.getValue('userToken')) {
      this.http
        .post<any>(`${environment.auth_prefix_url}/admin/logout`, {})
        .subscribe();
      this.appPreferences.clearAll();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
