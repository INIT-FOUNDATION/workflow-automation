import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';

import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private deviceService: DeviceDetectorService,
               ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        const isDesktopDevice = this.deviceService.isDesktop();
        let headers = {
          'uo-device-type': deviceInfo.deviceType,
          'uo-os': deviceInfo.os,
          'uo-os-version': deviceInfo.os_version,
          'uo-is-mobile': ''+isMobile,
          'uo-is-tablet': ''+isTablet,
          'uo-is-desktop': ''+isDesktopDevice,
          'uo-browser-version': deviceInfo.browser_version,
          'uo-browser': deviceInfo.browser
        };
        if (!request.url.includes("api.ipify.org")) {
            request = request.clone({
                setHeaders: headers
            });
        }
        return next.handle(request);
    }
}
