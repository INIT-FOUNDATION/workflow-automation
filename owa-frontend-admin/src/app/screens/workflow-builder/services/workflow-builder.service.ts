import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkflowBuilderService {
  constructor(private http: HttpClient) {}

  getTaskList() {
    return this.http.get(`${environment.workflow_prefix_url}/nodesList`);
  }
}
