import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as CryptoJS from 'crypto-js';
import { CommanService } from 'src/app/modules/shared/services/comman.service';

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.scss']
})
export class LoginOtpComponent {
  currentScreen = 'sendOtp';
  loginOtpForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private commanService: CommanService
  ) {
this.loginOtpForm = this.fb.group({
mobileNumber: ['', Validators.required],
otp: ['', Validators.required],
txnId: ['', Validators.required],
});
}

sendOtp() {
  let mobileNumber = this.loginOtpForm.get('mobileNumber').value;
  let payload : any = {
    mobile_number : mobileNumber
  }
  this.authService.generateOtp(payload).subscribe((res)=>{
    this.loginOtpForm.get('txnId').setValue(res.txnId);

  })
  this.currentScreen = 'enterOtp';
}

verifyOtp() {
let secretKey = 'OWA@$#&*(!@%^&';
let otp = this.loginOtpForm.get('otp').value;
let txnId = this.loginOtpForm.get('txnId').value;

let encryptedOtp = CryptoJS.AES.encrypt(otp, secretKey).toString();

let payload: any = {
  otp: encryptedOtp,
  txnId: txnId
};

this.authService.validateOtp(payload).subscribe((res) => {
  this.loginOtpForm.get('txnId').setValue(res.data.txnId);
  this.commanService.getUserDetails({token: res.data.token, redirect: true});
});
}
}
