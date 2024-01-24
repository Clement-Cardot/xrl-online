import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiUserService } from 'src/app/core/services/api-user.service';
import { CurrentUserService } from 'src/app/core/services/current-user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form?.submitted;
    return !!(
      control?.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  requestInProgress: boolean = false;

  loginForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  usernameFormControl = new FormControl('', [Validators.required]);

  // passwordFormControl = new FormControl('', [Validators.required]);
  // showPassword: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiUserService: ApiUserService,
    private currentUserService: CurrentUserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private _snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  /**
   * Initializes the component and creates a form group for the login form.
   * @returns void
   */
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: this.usernameFormControl,
      // password: this.passwordFormControl
    });
  }

  /**
   * Logs in the user using the login form data.
   * If the form is invalid, returns without doing anything.
   * Otherwise, sets the requestInProgress flag to true and sends a login request to the API.
   * If the login request is successful:
   *  1. sets the current user with the API answer
   *  2. sets the requestInProgress flag to false,
   *  3. closes the dialog.
   *  4. opens a snackbar with a success message.
   *
   * If the login request fails:
   *  1. handles the error
   *  2. sets the requestInProgress flag to false.
   * @returns void
   */
  login(): void {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.requestInProgress = true;

      this.usernameFormControl.markAsUntouched();
      this.usernameFormControl.updateValueAndValidity();

      this.apiUserService.login(this.loginForm.value.login).subscribe({
        next: (v) => {
          this.requestInProgress = false;
          this.currentUserService.setCurrentUser(v);
          this.dialogRef.close();
          this.openSnackBar();
        },
        error: (e) => {
          this.requestInProgress = false;
          this.handleError(e);
        },
      });
    }
  }

  /**
   * Opens a snackbar with a success message after a successful login attempt.
   * @returns void
   */
  openSnackBar(): void {
    this._snackBar.open(
      this.translate.instant('LOGIN.SUCCESS', {
        username: this.loginForm.value.login,
      }),
      this.translate.instant('ACTION.CLOSE'),
      { duration: 5000 }
    );
  }

  /**
   * Updates the form control errors and touched status for the username field when the username field changes.
   * @returns void
   */
  onChange(): void {
    this.usernameFormControl.setErrors({ incorrect: false });
    // this.passwordFormControl.setErrors({ 'incorrect': false });

    this.usernameFormControl.markAsTouched();
    // this.passwordFormControl.markAsTouched();

    this.usernameFormControl.updateValueAndValidity();
    // this.passwordFormControl.updateValueAndValidity();
  }

  /**
   * Handles errors that occur during login.
   * If the error is a 404, sets the username form control as incorrect.
   * @param error - The error object to handle.
   * @returns void
   */
  handleError(error: any): void {
    switch (error.status) {
      case 404: // Not found
        this.usernameFormControl.setErrors({ incorrect: true });
        break;
      default:
        console.error('This error is not handled: ', error.status, error.message);
        break;
    }
  }
}
