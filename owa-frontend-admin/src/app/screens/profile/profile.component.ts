import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminManagementService } from '../admin-management/services/admin-management.service';
import * as moment from 'moment';
import { AuthService } from '../auth/services/auth.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { ProfileService } from './service/profile.service';
import { AppPreferencesService } from 'src/app/modules/shared/services/preferences.service';
import { CommanService } from 'src/app/modules/shared/services/comman.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonImageUploadComponent } from 'src/app/modules/shared/components/common-image-upload/common-image-upload.component';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user_id: any;
  activeScreen = 'view_profile';
  uploadedFile;
  croppedImage;
  personDetails;
  userDetails;

  constructor(
    public adminManagementService: AdminManagementService,
    public authService: AuthService,
    private utilService: UtilityService,
    private profileService: ProfileService,
    private appPreference: AppPreferencesService,
    private commonService: CommanService,
    private dialog: MatDialog,
  ) {}

  profileForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    mobile_number: new FormControl('', [Validators.required]),
    email_id: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.fetchUserInfo();
    this.profileForm.get('mobile_number').disable();
    let details = this.appPreference.getValue('oll_user_details');
    this.userDetails = JSON.parse(details);
    this.profileForm.updateValueAndValidity();
  }

  fetchUserInfo(): void {
    this.authService.getLoggedInUserInfo().subscribe(
      response => {
        const userInfo = response.data;
        this.profileForm.patchValue({
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          dob: moment(userInfo.dob, 'DD/MM/YYYY').toDate(),
          mobile_number: userInfo.mobile_number,
          email_id: userInfo.email_id,
        });
      },
      error => {
        console.error('Error fetching user info:', error);
      }
    );
  }

  changeScreen(screen) {
    this.activeScreen = screen;
  }

  cancelProfileUpload() {
    this.activeScreen = 'view_profile';
    this.backUpload();
  }

  backUpload() {
    this.uploadedFile = null;
    this.croppedImage = null;
  }

  cancelProfilePreviewUpload() {
    this.activeScreen = 'view_profile';
    this.backUpload();
  }

  dilodResponse;
  openImageUploadDialog() {
    const dialogRef = this.dialog.open(CommonImageUploadComponent, {
      data: {
        dialog_title: 'Profile Pic Upload',
        width: 300,
        height: 300,
        aspectRatio: true,
        ratio: 1 / 1
      },
      width: '50%',
      height:'600px',
      disableClose: true,
      panelClass: 'my-dialog'
    });

    dialogRef.afterClosed().pipe(
      switchMap((res: any) => {
        if (res.type == 'close') {
          return of(null);
        } else {
          const formData = new FormData();
          this.dilodResponse = res;
          formData.append('file',  res.image_blob, 'profile_pic.png');
          return this.profileService.uploadProfilePic(formData);
        }
      })
    ).subscribe(async(response) => {
      if (response) {
        await this.commonService.getUserDetails();
        const reader = new FileReader();
        reader.readAsDataURL(this.dilodResponse.image_blob);
        reader.onload = (e) => { 
          let details = this.appPreference.getValue('oll_user_details');
          this.userDetails = JSON.parse(details);
          this.utilService.showSuccessMessage('Profile Picture Uploaded Successfully');
        };
      }
    }, error => {
    if (error.status === 400){
      // this.util.showErrorToast(this.translate.instant('Format Not Supported'));
    } else {
      this.utilService.showSuccessMessage('Error In Profile Picture Upload');
    }});
  }

  submitProfileForm() {
    let data = this.profileForm.getRawValue();
    // if (!data.password || !data.confirmPassword) {
    //   delete data.password;
    //   delete data.confirmPassword;
    // }
    this.profileService.updateProfile(data).subscribe((res) => {
      // if (data.password && data.confirmPassword) {
      //   this.authService.logout();
      //   this.router.navigate(['/login']);
      // }
      this.commonService.getUserDetails();
      this.utilService.showSuccessMessage('Profile updated successfully');
      this.activeScreen = 'view_profile';
    });
  }

}
