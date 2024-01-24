import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/core/data/models/user.model';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss'],
})
export class UserFormDialogComponent implements OnInit {

  @Input() user?: UserModel
  @Input() title: string = '';
  @Input() save: string = '';

  @Output() onSubmit: EventEmitter<UserModel> = new EventEmitter<UserModel>();

  editUserForm!: FormGroup;
  firstnameFormControl!: FormControl;
  lastnameFormControl!: FormControl;
  loginFormControl!: FormControl;

  private eventsSubscription?: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, save: string, user?: UserModel },
    private translate: TranslateService,
    private formBuilder: FormBuilder,
  ) { 
    this.title = data.title;
    this.save = data.save;
    this.user = data.user;
  }

  ngOnInit(): void {
    this.firstnameFormControl = new FormControl(this.user?.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]);
    this.lastnameFormControl = new FormControl(this.user?.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]);
    this.loginFormControl = new FormControl(this.user?.login, [Validators.required, Validators.minLength(5), Validators.maxLength(35)]);
    this.editUserForm  =  this.formBuilder.group({
      firstnameFormControl: this.firstnameFormControl,
      lastnameFormControl: this.lastnameFormControl,
      loginFormControl: this.loginFormControl,
    });
  }

  ngOnDestroy() {
    if (this.eventsSubscription != null) {
      this.eventsSubscription.unsubscribe();
    }
  }

  getFirstNameErrorMessage(): string {
    if (this.firstnameFormControl.hasError('required')) {
      return this.translate.instant('USER.FIRSTNAME_REQUIRED');
    } else if (this.firstnameFormControl.hasError('minlength')) {
      return this.translate.instant('USER.FIRSTNAME_MIN_LENGTH');
    } else if (this.firstnameFormControl.hasError('maxlength')) {
      return this.translate.instant('USER.FIRSTNAME_MAX_LENGTH');
    }
    return '';
  }

  getLastNameErrorMessage(): string {
    if (this.lastnameFormControl.hasError('required')) {
      return this.translate.instant('USER.LASTNAME_REQUIRED');
    } else if (this.lastnameFormControl.hasError('minlength')) {
      return this.translate.instant('USER.LASTNAME_MIN_LENGTH');
    } else if (this.lastnameFormControl.hasError('maxlength')) {
      return this.translate.instant('USER.LASTNAME_MAX_LENGTH');
    }
    return '';
  }

  getLoginErrorMessage(): string {
    if (this.loginFormControl.hasError('required')) {
      return this.translate.instant('LOGIN.LOGIN_REQUIRED');
    } else if (this.loginFormControl.hasError('minlength')) {
      return this.translate.instant('LOGIN.LOGIN_MIN_LENGTH');
    } else if (this.loginFormControl.hasError('maxlength')) {
      return this.translate.instant('LOGIN.LOGIN_MAX_LENGTH');
    }
    if (this.loginFormControl.hasError('loginAlreadyExists')) {
      return this.translate.instant('USER.LOGIN_ALREADY_EXISTS');
    }
    return '';
  }

  saveUser() {
    this.editUserForm.markAllAsTouched();
    if (!this.editUserForm.invalid) {
      const user: UserModel = new UserModel(
        this.user?.id ?? "",
        this.editUserForm.value.loginFormControl,
        this.editUserForm.value.firstnameFormControl,
        this.editUserForm.value.lastnameFormControl
      );
      this.onSubmit.emit(user);
    }
  }

}
