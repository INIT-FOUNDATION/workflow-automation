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

  getFormFields() {
    return this.http.get(`${environment.forms_prefix_url}/fields`);
  }

  getPropertiesFormFields(field_id: number) {
    return this.http.get(
      `${environment.forms_prefix_url}/fieldPropertiesDetails/${field_id}`
    );
  }

  createForm(payload) {
    return this.http.post(`${environment.forms_prefix_url}/create`, payload);
  }

  updateForm(payload) {
    return this.http.post(`${environment.forms_prefix_url}/update`, payload);
  }

  updateStatus(payload) {
    return this.http.post(
      `${environment.forms_prefix_url}/updateStatus`,
      payload
    );
  }

  getFormDetailsById(form_id: number) {
    return this.http.get(
      `${environment.forms_prefix_url}/details/${form_id}`
    );
  }
}
