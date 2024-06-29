import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AppPreferencesService } from '../modules/shared/services/preferences.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private appPreferences: AppPreferencesService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userToken = this.appPreferences.getValue('userToken');
    if (userToken) {
      request = request.clone({
        setHeaders: {
          Authorization: JSON.parse(userToken),
        },
      });
    }
    return next.handle(request);
  }
}
