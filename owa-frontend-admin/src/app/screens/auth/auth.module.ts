import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './component/login/login.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { LoginOtpComponent } from './component/login-otp/login-otp.component';


@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    ForgotPasswordComponent,
    LoginOtpComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
