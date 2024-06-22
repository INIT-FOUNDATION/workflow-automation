import { Component } from '@angular/core';
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
  ) {}

  ngOnInit(): void {
    this.userData = sessionStorage.getItem('userDetails');
    this.userData = JSON.parse(this.userData)
    console.log(this.userData)
  }

  logoutUser(): void {
    
     this.authService.logout();
  }
}
