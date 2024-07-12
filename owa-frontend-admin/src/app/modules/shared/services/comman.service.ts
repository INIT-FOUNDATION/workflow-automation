import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncDecService } from './encryption-decryption.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { DataService } from './data.service';
import { switchMap } from 'rxjs';
import { AppPreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root',
})
export class CommanService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService,
    private encDecService: EncDecService,
    private router: Router,
    private appPreferences: AppPreferencesService
  ) {}

  async getUserDetails(tokenInfo?: { token: string; redirect: boolean }) {
    console.log(tokenInfo)
    let role_id;
    let user_id;
    let loggedInUserDetails : any
    if (tokenInfo) {
      this.appPreferences.setValue('userToken', JSON.stringify(tokenInfo.token))
    }
    this.authService.getLoggedInUserInfo().pipe(
      switchMap((userRes: any) => {
        loggedInUserDetails = userRes.data
        role_id = loggedInUserDetails.role_id;
        user_id = loggedInUserDetails.user_id; 
        return this.authService.getMenuList(role_id);
      })
    ).subscribe((permissionRes: any) => {
      loggedInUserDetails.menuList = permissionRes.data;
      loggedInUserDetails.permission = {};
      if (loggedInUserDetails.menuList && loggedInUserDetails.menuList.length > 0) {
        loggedInUserDetails.menuList.forEach(menuItem => {
          this.updatePermissions(menuItem, loggedInUserDetails.permission);
        });  
      }
      this.appPreferences.setValue("oll_user_details", JSON.stringify(loggedInUserDetails));
      this.dataService.userDetails = loggedInUserDetails;
      this.dataService.setProfilePic(loggedInUserDetails.profile_pic_url);
      this.dataService.permissions = loggedInUserDetails.menuList
      if (tokenInfo) {
        this.authService.currentUserSubject.next(tokenInfo.token);
        this.authService.redirectAsperPermission();
      }
    });
  }


  updatePermissions(menuItem, permission) {
    let menu_name = menuItem.menu_name;
    permission[menu_name] = 'NP';
    if (menuItem.write_permission == 1 && menuItem.read_permission == 1) {
      permission[menu_name] = 'FULL';
    } else if (menuItem.write_permission == 0 && menuItem.read_permission == 1) {
      permission[menu_name] = 'READ';
    } else if (menuItem.write_permission == 1 && menuItem.read_permission == 0) {
      permission[menu_name] = 'FULL';
    }
  }
}
