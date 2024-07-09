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

  getGridData(payload) {
    return this.http.post(`${environment.workflow_prefix_url}/list`, payload);
  }

  createWorkflow(payload) {
    return this.http.post(`${environment.workflow_prefix_url}/create`, payload);
  }

  updateWorkflow(payload) {
    return this.http.post(`${environment.workflow_prefix_url}/update`, payload);
  }

  getWorkflowById(workflowId: any) {
    return this.http.get(`${environment.workflow_prefix_url}/id/${workflowId}`);
  }
}
