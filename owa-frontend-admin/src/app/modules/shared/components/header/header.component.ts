import { Component } from '@angular/core';
import { AuthService } from 'src/app/screens/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  showProfileCard: boolean = false;
  userName: string = 'CK';

  constructor(
    public authService: AuthService,
  ) {}

  ngOnInit(): void {}

  // logoutUser(): void {
  //   this.authService.logout();
  // }
}
