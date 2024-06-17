import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';

import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private deviceService: DeviceDetectorService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    const userToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJkZXBhcnRtZW50X2lkIjpudWxsLCJyb2xlX2lkIjoxLCJ1c2VyX25hbWUiOiIxMjM0NTY3ODkwIiwiZW1haWxfaWQiOm51bGwsImxldmVsIjoiQWRtaW4iLCJ1YSI6IlByb3h5c2NvdGNoLzEuMSIsImRhdGVfbW9kaWZpZWQiOiIyMDI0LTA2LTE3VDA5OjQxOjI5LjcwMloiLCJpYXQiOjE3MTg2MTcyODksImV4cCI6MTcxODY0NjA4OX0.7TCBpfKIgD_DnxBohmXsf62fKk6EIH_dOwLADHlGc5g';
    let headers = {
      'uo-device-type': deviceInfo.deviceType,
      'uo-os': deviceInfo.os,
      'uo-os-version': deviceInfo.os_version,
      'uo-is-mobile': '' + isMobile,
      'uo-is-tablet': '' + isTablet,
      'uo-is-desktop': '' + isDesktopDevice,
      'uo-browser-version': deviceInfo.browser_version,
      'uo-browser': deviceInfo.browser,
    };
    if (userToken) {
      // headers['Authorization'] = JSON.parse(userToken);
      headers['Authorization'] = userToken;
    }
    if (!request.url.includes('api.ipify.org')) {
      request = request.clone({
        setHeaders: headers,
      });
    }
    return next.handle(request);
  }
}
