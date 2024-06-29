import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  currentScreen = 'sendOtp';
  forgotPasswordForm: FormGroup;

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
      console.log(res.txnId)
      this.currentScreen = 'enterOtp';
    })

}

verifyOtp() {
    let otp = this.forgotPasswordForm.get('otp').value;
    otp = this.encryptService.set("otp");
    let txnId = this.forgotPasswordForm.get('txnId').value;
    console.log(typeof otp)
    console.log(txnId)
    
    let payload : any = {
      otp : otp,
      txnId : txnId
    }
    this.authService.verifyForgotPasswordOtp(payload).subscribe((res)=>{
      console.log(res)
      this.currentScreen = 'resetPassword';
    })
}

resetPassword() {
    if (this.forgotPasswordForm.valid) {
      let newPassword = this.forgotPasswordForm.get('newPassword').value;
      newPassword = this.encryptService.set('newPassword');
      let confirmPassword = this.forgotPasswordForm.get('confirmPassword').value;
      confirmPassword = this.encryptService.set("confirmPassword");
      let txnId = this.forgotPasswordForm.get('txnId').value;
      
      let payload : any = {
        txnId : txnId,
        newPassword : newPassword,
        confirmPassword : confirmPassword
      }

      if (newPassword === confirmPassword) {
        this.authService.resetForgotPassword(payload).subscribe((res) => {
          this.utilsService.showSuccessMessage('Password updated successfully');
          this.router.navigate(['/login']);
        });
    } else {
        alert('Passwords do not match');
    }


    } 
}

}
