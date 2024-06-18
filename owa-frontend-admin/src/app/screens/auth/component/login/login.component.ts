import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EncDecService } from 'src/app/modules/shared/services/encryption-decryption.service';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { CommanService } from 'src/app/modules/shared/services/comman.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private encDecService: EncDecService,
    private authService: AuthService,
    private utilityService: UtilityService,
    private commanService: CommanService,
   ) { }

  loginform : FormGroup
  ngOnInit(): void {
    this.initForm();
  }


  initForm(){
    this.loginform = new FormGroup({
      user_name : new FormControl(null,[
        Validators.required,
        Validators.maxLength(10)
      ]),
      password : new FormControl(null,[Validators.required])
    })
  }

  login(){
    if(this.loginform.valid){
      
      let loginDetails = this.loginform.getRawValue();
      loginDetails.password = this.encDecService.set(loginDetails.password),
        this.authService.login(loginDetails).subscribe((res : any)=>{
          sessionStorage.setItem('userToken', JSON.stringify(res.data.token))
          this.commanService.getUserDetails(res.data.token)
        })
    }
  }
}
