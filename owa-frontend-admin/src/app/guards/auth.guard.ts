import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../screens/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private auth: AuthService,
  ) {
  }
  routes_navigation_without_login = ['/login'];
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.auth.currentUserValue) {
      if (this.routes_navigation_without_login.indexOf(state.url) != -1) {
        this.auth.redirectAsperPermission();
      }
      return true;
    } else {
      if (this.routes_navigation_without_login.indexOf(state.url) == -1) {
        this.router.navigate(['/login']);
      }
      return true;
    }
  }
}
