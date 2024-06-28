import { AppPreferencesService } from './../modules/shared/services/preferences.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router, NavigationExtras } from '@angular/router';
import { ErrorCodes } from './error-codes.module';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../modules/shared/services/utility.service';
import { AuthService } from '../screens/auth/services/auth.service';


/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private appPreferences: AppPreferencesService,
    private dialog:  MatDialog,
    private utilityService: UtilityService,
    private authService: AuthService
    ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    // if (!environment.production) {
    //   // Do something with the error
    //   // console.log('Request error', response);
    // }

    const isJson = (str: string) => {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
    };

    if (response instanceof HttpErrorResponse) {
      switch (response.status) {
        case 401:      // login
          this.authService.logout();
          break;
        case 403:     // forbidden
          this.router.navigateByUrl('/forbidden');
          break;
        case 409:
        case 400:
          if (response.error) {
            this.utilityService.showErrorMessage(response.error.errorMessage);
          } 
          else {
            this.utilityService.showErrorMessage("Something went wrong");
          }

          break;
        case 0:
          if (window.navigator.onLine){
            this.utilityService.showErrorMessage('Something went wrong. Please try again!');
            break;
          } else if (!window.navigator.onLine) {
            this.utilityService.showErrorMessage('Something went wrong. Please try again!');
            break;
          }
          else {
            break;
          }

      }
    }
    throw response;
  }
}
