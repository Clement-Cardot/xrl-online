import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/core/data/models/user.model';

@Component({
  selector: 'app-user-form-dialog-component',
  templateUrl: './user-form-dialog-component.component.html',
  styleUrls: ['./user-form-dialog-component.component.scss'],
})
export class UserFormDialogComponentComponent implements OnInit {

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
  ) { 
    this.title = data.title;
    this.save = data.save;
    this.user = data.user;
  }

  ngOnInit(): void {
    this.firstnameFormControl = new FormControl(this.user?.firstName, [Validators.required], );
    this.lastnameFormControl = new FormControl(this.user?.lastName, [Validators.required], );
    this.loginFormControl = new FormControl(this.user?.login, [Validators.required], );
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
      return this.translate.instant('USERS.FIRSTNAME_REQUIRED');
    }
    return '';
  }

  getLastNameErrorMessage(): string {
    if (this.lastnameFormControl.hasError('required')) {
      return this.translate.instant('USERS.LASTNAME_REQUIRED');
    }
    return '';
  }

  getLoginErrorMessage(): string {
    if (this.loginFormControl.hasError('required')) {
      return this.translate.instant('USERS.LOGIN_REQUIRED');
    }
    if (this.loginFormControl.hasError('loginAlreadyExists')) {
      return this.translate.instant('USERS.LOGIN_ALREADY_EXISTS');
    }
    return '';
  }

  saveUser() {
    if (!this.editUserForm.invalid) {
      const user: UserModel = {
        id: this.user?.id ?? "",
        firstName: this.editUserForm.value.firstnameFormControl,
        lastName: this.editUserForm.value.lastnameFormControl,
        login: this.editUserForm.value.loginFormControl,
      };
      this.onSubmit.emit(user);
    }
  }

}
