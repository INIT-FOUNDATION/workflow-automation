import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { CookieService } from '../services/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private activeThem = new BehaviorSubject('light_theme');
  active_theme = 'light_theme';
  constructor(private cookieService: CookieService) {
    const theme = this.cookieService.getCookie("theme");
    this.active_theme = theme ? theme : 'light_theme';
    this.activeThem.next(this.active_theme);
  }

  public get getActiveTheme() {
    return this.activeThem.asObservable();
  }

  public setActiveThem(name) {
    this.cookieService.deleteCookie('theme');
    this.cookieService.setCookie('theme', name);
    this.activeThem.next(name);
  }


}
