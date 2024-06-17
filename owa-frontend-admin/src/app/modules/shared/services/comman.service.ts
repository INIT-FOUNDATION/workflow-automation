import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/screens/auth/auth.service';
import { EncDecService } from './encryption-decryption.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommanService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private encDecService: EncDecService,
    private router: Router
  ) {}

  async getUserDetails() {
    let role_id;
    let user_id;
    let loggedInUserDetails : any
    this.authService.getLoggedInUserInfo().subscribe((res) => {
      loggedInUserDetails = res.data
      role_id = res.data.role_id;
      user_id = res.data.user_id; 
      this.authService.getMenuList(role_id).subscribe((res)=>{
        loggedInUserDetails.menuList = res.data
        sessionStorage.setItem('userDetails',JSON.stringify(loggedInUserDetails))
        this.router.navigate([`/admin-management`]);
      })
        
    });
  }
}
