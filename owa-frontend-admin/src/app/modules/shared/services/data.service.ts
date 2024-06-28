import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
declare var require: any;

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _userDetails: any;
  private permissionSubject: BehaviorSubject<any>;
  public permissionPresent$: Observable<any>;
  private userDataSubject: BehaviorSubject<any>;
  public userData: Observable<any>;
  private profilePicSubject: BehaviorSubject<any>;
  public profilePic: Observable<any>;

  constructor(private http: HttpClient) {
    this.permissionSubject = new BehaviorSubject<any>(false);
    this.permissionPresent$ = this.permissionSubject.asObservable();

    this.userDataSubject = new BehaviorSubject<any>(null);
    this.userData = this.userDataSubject.asObservable();
    this.profilePicSubject = new BehaviorSubject<any>(null);
    this.profilePic = this.profilePicSubject.asObservable();
  }

  get userDetails() {
    return this._userDetails;
  }

  set userDetails(userDetails) {
    this._userDetails = {...this._userDetails, ...userDetails};
    this.userDataSubject.next(this._userDetails);
  }

  setProfilePic(data: any) {
    this.profilePicSubject.next(data);
  }

  set permissions(flag){
    this.permissionSubject.next(flag);
  }

}
