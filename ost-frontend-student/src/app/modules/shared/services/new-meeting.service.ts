import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NewMeetingService {
  constructor(private http: HttpClient, ) {}

  joinMeeting(payload) {
    return this.http.post(`${environment.meeting_prefix_url}/join`, payload)
  }
}
