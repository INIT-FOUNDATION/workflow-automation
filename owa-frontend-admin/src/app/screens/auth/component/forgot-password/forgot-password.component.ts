import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  currentScreen = 'sendOtp';
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
        mobileNumber: ['', Validators.required],
        otp: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
    });
}

  sendOtp() {
    this.currentScreen = 'enterOtp';
}

verifyOtp() {
    this.currentScreen = 'resetPassword';
}

resetPassword() {
    const newPassword = this.forgotPasswordForm.get('newPassword').value;
    const confirmPassword = this.forgotPasswordForm.get('confirmPassword').value;
    if (newPassword === confirmPassword) {
        alert('Password reset successful');
    } else {
        alert('Passwords do not match');
    }
}

}
