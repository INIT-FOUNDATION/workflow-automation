import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router,
  ) {
  }
  exclude_urls = ['/login'];
  urls_can_visit_bfr_login = ['/login', '/home'];
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
  
    return true;
  }

  // if (this.auth.currentUserValue) {
  //   if (this.routes_navigation_without_login.indexOf(state.url) != -1) {
  //     //this.auth.redirectAsperPermission();
  //   }
  //   return true;
  // } else {
  //   if (this.routes_navigation_without_login.indexOf(state.url) == -1) {
  //     this.router.navigate(['/login']);
  //   }
  //   return true;
  // }
}
