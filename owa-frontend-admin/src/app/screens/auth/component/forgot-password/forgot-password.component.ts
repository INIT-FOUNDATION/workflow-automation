import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  currentScreen = 'sendOtp';
  forgotPasswordForm: FormGroup;
  isPasswordVisible: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private utilsService: UtilityService,
              private encryptService: EncDecService
            ) {
    this.forgotPasswordForm = this.fb.group({
        mobileNumber: ['', Validators.required],
        otp: ['', Validators.required],
        txnId: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
    });
}

  sendOtp() {
    let mobileNumber = this.forgotPasswordForm.get('mobileNumber').value;
    let payload : any = {
      mobile_number : mobileNumber
    }
    this.authService.getForgotPasswordOtp(payload).subscribe((res)=>{
      this.forgotPasswordForm.get('txnId').setValue(res.data.txnId);
      this.currentScreen = 'enterOtp';
    })

}

verifyOtp() {
  let secretKey = 'OWA@$#&*(!@%^&';
  let otp = this.forgotPasswordForm.get('otp').value;
  let txnId = this.forgotPasswordForm.get('txnId').value;

  let encryptedOtp = CryptoJS.AES.encrypt(otp, secretKey).toString();

  let payload: any = {
    otp: encryptedOtp,
    txnId: txnId
  };

  this.authService.verifyForgotPasswordOtp(payload).subscribe((res) => {
    this.forgotPasswordForm.get('txnId').setValue(res.data.txnId);
    this.currentScreen = 'resetPassword';
  });
}

resetPassword() {
    if (this.forgotPasswordForm.valid) {
      let secretKey = 'OWA@$#&*(!@%^&';
      let newPassword = this.forgotPasswordForm.get('newPassword').value;
      let encryptedNewPassword = CryptoJS.AES.encrypt(newPassword, secretKey).toString();
      let confirmPassword = this.forgotPasswordForm.get('confirmPassword').value;
      let encryptedConfirmPassword = CryptoJS.AES.encrypt(confirmPassword, secretKey).toString();
      let txnId = this.forgotPasswordForm.get('txnId').value;
      
      let payload : any = {
        txnId : txnId,
        newPassword : encryptedNewPassword,
        confirmPassword : encryptedConfirmPassword
      }

      this.authService.resetForgotPassword(payload).subscribe((res) => {
        if(newPassword == confirmPassword){
          this.utilsService.showSuccessMessage('Password updated successfully');
          this.router.navigate(['/login']);
        } else{
          this.utilsService.showErrorMessage('Password does not match')
        }
      });

    } 
}

get passwordFieldType(): string {
  return this.isPasswordVisible ? 'text' : 'password';
}

togglePasswordVisibility(): void {
  this.isPasswordVisible = !this.isPasswordVisible;
}



}
