import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TokenInterceptor } from './interceptor/token.interceptor';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorHandlerInterceptor } from './interceptor/error-handler.interceptor';
import { SharedModule } from './modules/shared/shared.module';
import { LoaderInterceptor } from './interceptor/loader.interceptor';
import { ThemeModule } from './modules/shared/theme/theme.module';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { environment } from 'src/environments/environment';
import { CommonImageUploadComponent } from './modules/shared/components/common-image-upload/common-image-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    CommonImageUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    ThemeModule,
    // NgxGoogleAnalyticsModule.forRoot(environment.ga),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
