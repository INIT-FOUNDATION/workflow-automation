import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  login(payload) {
    return this.http.post<any>(`${environment.auth_prefix_url}/admin/login`, payload);
  }
}

