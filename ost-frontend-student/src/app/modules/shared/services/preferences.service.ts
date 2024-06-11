import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class AppPreferencesService {
  private DICT = "MEETING_APP_PREFERENCES";
  constructor() {
  }


  setValue(a_key: string, a_value: string) {
    let key = `${this.DICT}.${a_key}`;
    localStorage.setItem(key, a_value);
  }


  getValue(a_key: string) {
    let key = `${this.DICT}.${a_key}`;
    let data = localStorage.getItem(key);
    return data;
  }

  clearAll() {
    localStorage.clear();
  }
}
