import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  constructor(private http: HttpClient) {}

  getFormGridData(payload) {
    return this.http.post(`${environment.forms_prefix_url}/list`, payload);
  }
}
