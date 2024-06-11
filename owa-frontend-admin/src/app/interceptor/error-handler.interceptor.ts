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
    private utilityService: UtilityService
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
          if (this.appPreferences.getValue('userToken')) {
            this.router.navigateByUrl('/unauthorized');
          }
          break;
        case 403:     // forbidden
          this.router.navigateByUrl('/forbidden');
          break;
        case 409:
        case 400:
          if (response.error) {
            if (typeof(response.error) === 'string') {
              if (isJson(response.error)) {
                const errmsg = JSON.parse(response.error);

                if (errmsg.errorCode === 'MEET000117') {
                  const navigationExtras: NavigationExtras = {
                    state: errmsg,
                  };
                  this.router.navigate(['/waiting'], navigationExtras);
                  return;
                }


                if (errmsg.errorCode === 'MEET000124') {
                  return;
                }

                /* Password Policy Conditions */
                if (errmsg.errorCode === 'USRAUT0004' ||
                errmsg.errorCode === 'USRAUT0005' ||
                errmsg.errorCode === 'USRAUT0006' || errmsg.errorCode === 'USRAUT0007') {
                  if (errmsg.errorCode === 'USRAUT0004') {
                    const userId = errmsg.userId;
                    // this.authService.userId = userId;
                    this.router.navigate(['/login/updatepassword']);
                  } else if (errmsg.errorCode === 'USRAUT0005') {
                    this.utilityService.showErrorMessage(errmsg.error);
                    setTimeout(() => {
                      this.router.navigate(['/login/forget']);
                    }, 100);
                  } else if (errmsg.errorCode === 'USRAUT0006') {
                    const userId = errmsg.userId;
                    // this.authService.userId = userId;
                    this.utilityService.showErrorMessage(errmsg.error);
                    setTimeout(() => {
                      this.router.navigate(['/login/updatepassword']);
                    }, 100);
                  } else if (errmsg.errorCode === 'USRAUT0006' || errmsg.errorCode === 'USRAUT0007') {
                    const userId = errmsg.userId;
                    // this.authService.userId = userId;
                    this.utilityService.showErrorMessage(errmsg.error);
                    setTimeout(() => {
                      this.router.navigate(['/login/updatepassword']);
                    }, 100);
                  }
                } else if (errmsg.errorCode == 'CONFIG0001') {
                  this.utilityService.showErrorMessage(errmsg.error);

                  // this.openPopupForConfig(errmsg.user_name)
                } else {
                  if (errmsg.errorCode) {
                    let errorCode: any = errmsg.errorCode;
                    const errorMessage: any = ErrorCodes[errorCode];
                    if (errorMessage) {
                      this.utilityService.showErrorMessage(errorMessage);
                    } else {
                      this.utilityService.showErrorMessage(errmsg.error);
                    }
                  } else {
                    this.utilityService.showErrorMessage(response.error);
                  }
                }
              } else {
                this.utilityService.showErrorMessage(response.error);
              }
            } else if (response.error.errorCode) {
              if (response.error.errorCode === 'MEET000117') {
                this.dialog.closeAll();
                const navigationExtras: NavigationExtras = {
                  state: response.error,
                };
                this.router.navigate(['/waiting'], navigationExtras);
              }else if (response.error.errorCode === 'MEET000124') {
                this.utilityService.showErrorMessage(response.error.error);
              }else if (response.error.errorCode !== 'ADMROL0002') {
                this.utilityService.showErrorMessage(`${response.error.error}`);
              }

            } else {
              try{
                this.utilityService.showErrorMessage(response.error.message);
              } catch (e) {
                console.error('Error!!! ', e);
              }
            }
          } else {
            this.utilityService.showErrorMessage(response.error);
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
