import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  showProfileCard: boolean = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
  }

  userProfile(){
    this.router.navigate(['/profile']); 
  }

  logoutUser(): void {
     this.authService.logout();
  }
}
