import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as AOS from 'aos';
import 'aos/dist/aos.css';
import { ThemeService } from './modules/shared/theme/theme.service';
import { CookieService } from './modules/shared/services/cookies.service';
import { UtilityService } from './modules/shared/services/utility.service';
import { AuthService } from './screens/auth/services/auth.service';
import { DataService } from './modules/shared/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  display = false;
  showHeader = false
  constructor(
     public authService : AuthService,
    private themeService: ThemeService,
    private router: Router,
    private dataService: DataService,
    public utilityService: UtilityService
  ) {}


  ngOnInit(): void {
    this.authService.currentUser.subscribe(async (res) => {
      
      if(res){
        this.showHeader = true
        const loggedInuserDetails =  sessionStorage.getItem('userDetails')
        let loggedinData = JSON.parse(loggedInuserDetails)
        this.dataService.permissions = loggedinData.menuList
        
      }else{
        this.router.navigate([`/login`]);
      }
      
    })
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}
}
