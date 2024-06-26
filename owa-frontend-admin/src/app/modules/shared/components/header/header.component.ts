import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/screens/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  showProfileCard: boolean = false;
  userData: any = null;

  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.userData = sessionStorage.getItem('userDetails');
    this.userData = JSON.parse(this.userData)
  }

  userProfile(){
    this.router.navigate(['/profile']); 
  }

  logoutUser(): void {
    
     this.authService.logout();
  }
}
