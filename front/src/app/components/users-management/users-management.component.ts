import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserModel } from 'src/app/core/data/models/user.model';
import { ApiUserService } from 'src/app/core/services/api-user.service';
import { DeleteObjectDialogComponent } from '../dialogs/delete-object-dialog/delete-object-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { UserFormDialogComponent } from '../dialogs/user-form-dialog/user-form-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', "actions"];


  users: UserModel[] = [];
  currentUsers: UserModel[] = [];
  userControl = new FormControl('');

  constructor(
    private apiUserService: ApiUserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { 
    this.apiUserService.getAllUsers().subscribe({
      next: (v) => {
        this.users = v;
        this.currentUsers = v;
      },
      error: (e) => console.error(e)
    });
  }

  ngOnInit(): void {
    this.userControl.valueChanges.subscribe((value) => {
      if (value != null && value != '') {
        this._updateCurrentUsers(value);
      } else {
        this.currentUsers = this.users;
      }
    });  
  }

  private _updateCurrentUsers(value: string) {
    this.currentUsers = this.users.filter(user =>
      (this._filterCleanString(user.firstName) + " " + this._filterCleanString(user.lastName)).includes(this._filterCleanString(value!))
      || (this._filterCleanString(user.lastName) + " " + this._filterCleanString(user.firstName)).includes(this._filterCleanString(value!)));
  }

  private _filterCleanString(value: string): string {
    value = value.toLowerCase();
    value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return value;
  }

  openDeleteUserDialog(user: UserModel) {
    const dialogRef = this.dialog.open(DeleteObjectDialogComponent, {
      data: {
        title: 'USERS.DELETE_USER',
        content: user.firstName + ' ' + user.lastName
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiUserService.deleteUser(user.id).subscribe({
          next: (v) => {
            this.snackBar.open(this.translateService.instant('USERS.USER_DELETED'), this.translateService.instant('CLOSE'), {
              duration: 3000,
            });
            this.users = this.users.filter(u => u.id !== user.id);
            this._updateCurrentUsers(this.userControl.value!);
          },
          error: (e) => console.error(e)
        });
      }
    });
  }

  openEditUserDialog(user: UserModel) {
    const data = {
      user: user,
      title: 'USERS.EDIT_USER',
      save: 'SAVE'
    }
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      data: data,
      autoFocus: false
    });
    dialogRef.componentInstance.onSubmit.subscribe((result) => {
      if (result) {
        this.apiUserService.updateUser(result).subscribe({
          next: (v) => {
            this.snackBar.open(this.translateService.instant('USERS.USER_UPDATED'), this.translateService.instant('CLOSE'), {
              duration: 3000,
            });
            this.users = this.users.map(u => u.id === user.id ? result : u);
            this._updateCurrentUsers(this.userControl.value!);
            dialogRef.close();
          },
          error: (e) => {
            if (e.status === 409) {
              dialogRef.componentInstance.loginFormControl.setErrors({loginAlreadyExists: true});
            } else {
              console.error(e);
            }
          }
        });
      }
   });
  }

  mouseEnterActionsButton(user: UserModel) {
    document.getElementById('list-users-actions-' + user.login)!.style.visibility = 'visible';
  }

  mouseLeaveActionsButton(user: UserModel) {
    document.getElementById('list-users-actions-' + user.login)!.style.visibility = 'hidden';
  }

  openAddUserDialog() {
    const data = {
      title: 'USERS.CREATE_USER',
      save: 'CREATE'
    }
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      data: data,
      autoFocus: false
    });
    dialogRef.componentInstance.onSubmit.subscribe((result) => {
      if (result) {
        this.apiUserService.createUser(result).subscribe({
          next: (v) => {
            this.snackBar.open(this.translateService.instant('USERS.USER_CREATED'), this.translateService.instant('CLOSE'), {
              duration: 3000,
            });
            this.users.push(result);
            this._updateCurrentUsers(this.userControl.value!);
            dialogRef.close();
          },
          error: (e) => {
            if (e.status === 409) {
              dialogRef.componentInstance.loginFormControl.setErrors({loginAlreadyExists: true});
            }
          }
        });
      }
   });
  }
}
