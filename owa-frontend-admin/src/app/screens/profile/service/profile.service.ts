import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient,) { }

  uploadProfilePic(payload) {
    return this.http.post(
      `${environment.user_prefix_url}/admin/updateProfilePic`,
      payload
    );
  }

  updateProfile(payload) {
    return this.http.post(
      `${environment.user_prefix_url}/admin/updateProfile`,
      payload
    );
  }
}
