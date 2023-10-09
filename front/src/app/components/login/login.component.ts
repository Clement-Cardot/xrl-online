import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ApiUserService } from 'src/app/core/services/api-user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form?.submitted;
    return !!( control?.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  usernameFormControl = new FormControl('', [Validators.required]);
  // passwordFormControl = new FormControl('', [Validators.required]);
  // showPassword: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiUserService: ApiUserService
    ) {
  }

  ngOnInit(): void {
    // TODO : Clear current user
    this.loginForm  =  this.formBuilder.group({
      login: this.usernameFormControl,
      // password: this.passwordFormControl
    });
  }

  login(): void {
    if(this.loginForm.invalid){
      return;
    } else {
      this.apiUserService.login(this.loginForm.value.login).subscribe({
          next: (v) => console.log(v),
          error: (e) => console.error(e)
        }
      );
    }
  }

  onChange(): void {
    this.usernameFormControl.setErrors({ 'incorrect': false });
    // this.passwordFormControl.setErrors({ 'incorrect': false });

    this.usernameFormControl.markAsTouched();
    // this.passwordFormControl.markAsTouched();

    this.usernameFormControl.updateValueAndValidity();
    // this.passwordFormControl.updateValueAndValidity();
  }
}
