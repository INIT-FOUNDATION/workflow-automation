import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
declare var require: any;

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private permissionSubject: BehaviorSubject<any>;
  public permissionPresent$: Observable<any>;

  constructor(private http: HttpClient) {
    this.permissionSubject = new BehaviorSubject<any>(false);
    this.permissionPresent$ = this.permissionSubject.asObservable();
  }

  set permissions(flag){
    this.permissionSubject.next(flag);
  }

}
