import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from 'src/app/core/data/models/user.model';
import { ApiTeamService } from 'src/app/core/services/api-team.service';
import { ApiUserService } from 'src/app/core/services/api-user.service';
import { TeamModel } from '../../../core/data/models/team.model';

@Component({
  selector: 'app-add-update-team-dialog',
  templateUrl: './add-update-team-dialog.component.html',
  styleUrls: ['./add-update-team-dialog.component.scss'],
})
export class AddUpdateTeamDialogComponent implements OnInit {

  team: TeamModel = new TeamModel('', '', []);

  userControl = new FormControl('');
  formControlTeamName: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
  ]);
  createTeamForm: FormGroup = this.formBuilder.group({
    name: this.formControlTeamName,
  });

  displayedColumns: string[] = ['firstName', 'lastName', 'actions'];

  users: UserModel[] = [];
  currentUsers: UserModel[] = [];

  @ViewChild('matTableMembers') table!: MatTable<UserModel>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddUpdateTeamDialogComponent>,
    private apiUserService: ApiUserService,
    private apiTeamService: ApiTeamService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    if (this.data != null) {
      this.team = this.data;
      this.formControlTeamName.markAsTouched();
    }
    this.apiUserService.getAllUsers().subscribe({
      next: (v) => {
        const ids_list = this.team.members.map((user) => user.id);
        this.users = v.filter((user) => !ids_list.includes(user.id));
        this.currentUsers = this.users;
      },
      error: (e) => console.error(e),
    });

    this.userControl.valueChanges.subscribe((value) => {
      if (value != null && value != '') {
        this._updateCurrentUsers(value);
      } else {
        this.currentUsers = this.users;
      }
    });
  }

  /**
   * Updates the list of current users based on the provided search value.
   * @param value - The search value to filter the users by.
   */
  private _updateCurrentUsers(value: string) {
    this.currentUsers = this.users.filter(
      (user) =>
        (
          this._filterCleanString(user.firstName) +
          ' ' +
          this._filterCleanString(user.lastName)
        ).includes(this._filterCleanString(value!)) ||
        (
          this._filterCleanString(user.lastName) +
          ' ' +
          this._filterCleanString(user.firstName)
        ).includes(this._filterCleanString(value!))
    );
  }

  /**
   * Returns a clean string with no diacritics and in lowercase.
   * @param value The string to clean.
   * @returns The cleaned string.
   */
  private _filterCleanString(value: string): string {
    value = value.toLowerCase();
    value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return value;
  }

  /**
   * Returns the title of the dialog based on whether the team is being updated or created.
   * @returns The title of the dialog as a string.
   */
  getDialogTitle(): string {
    if (this.team.id != '') {
      return this.translateService.instant('TEAM.UPDATE');
    } else {
      return this.translateService.instant('TEAM.CREATE');
    }
  }

  /**
   * Returns the button text of the dialog based on whether the team is being updated or created.
   * @returns The button text of the dialog as a string.
   */
  getDialogButton(): string {
    if (this.team.id != '') {
      return this.translateService.instant('ACTION.SAVE');
    } else {
      return this.translateService.instant('ACTION.CREATE');
    }
  }

  /**
   * Returns an error message based on the validation errors of the team name form control.
   * @returns The error message string.
   */
  getNameErrorMessage(): string {
    if (this.formControlTeamName.hasError('required')) {
      return this.translateService.instant('TEAM.NAME_REQUIRED');
    }
    if (this.formControlTeamName.hasError('minlength')) {
      return this.translateService.instant('TEAM.NAME_MIN_LENGTH');
    }
    if (this.formControlTeamName.hasError('maxlength')) {
      return this.translateService.instant('TEAM.NAME_MAX_LENGTH');
    }
    if (this.formControlTeamName.hasError('nameAlreadyExists')) {
      return this.translateService.instant('TEAM.NAME_ALREADY_EXISTS');
    }
    return '';
  }

  /**
   * Saves the team by creating a new team or updating an existing one.
   * @returns void
   */
  saveTeam() {
    const team: TeamModel = new TeamModel(
      this.team.id,
      this.formControlTeamName.value,
      this.team.members
    );
    if (this.team.id != '') {
      this.apiTeamService.updateTeam(team).subscribe({
        next: (teamresult) => {
          this.dialogRef.close(teamresult);
          this.snackBar.open(
            this.translateService.instant('TEAM.UPDATE_SUCCESS'),
            this.translateService.instant('CLOSE'),
            {
              duration: 3000,
            }
          );
        },
        error: (e) => {
          this.handleError(e);
        },
      });
    } else {
      this.apiTeamService.createTeam(team).subscribe({
        next: (teamresult) => {
          this.dialogRef.close(teamresult);
          this.snackBar.open(
            this.translateService.instant('TEAM.CREATE_SUCCESS'),
            this.translateService.instant('CLOSE'),
            {
              duration: 3000,
            }
          );
        },
        error: (e) => {
          this.handleError(e);
        },
      });
    }
  }

  /**
   * Displays action buttons for a user.
   * @param user - The user to display the action buttons for.
   * @returns void
   */
  enterActionsButton(user: UserModel) {
    document.getElementById('user-list-actions-' + user.login)!.style.display =
      'block';
  }

  /**
   * Hide the action buttons for a user.
   * @param user - The user to hide the action buttons for.
   * @returns void
   */
  leaveActionsButton(user: UserModel) {
    document.getElementById('user-list-actions-' + user.login)!.style.display =
      'none';
  }

  /**
   * Adds a user to the team members list and removes them from the available users list.
   * @param user - The user to add to the team members list.
   */
  addUserToMembers(user: UserModel) {
    this.team.members.push(user);
    this.users = this.users.filter((u) => u.id !== user.id);
    this._updateCurrentUsers(this.userControl.value!);
    this.table.renderRows();
  }

  /**
   * Removes a user from the team members list and adds them back to the available users list.
   * @param user - The user to remove from the team members list.
   */
  removeUserFromMembers(user: UserModel) {
    this.team.members = this.team.members.filter((u) => u.id !== user.id);
    this.users.push(user);
    this._updateCurrentUsers(this.userControl.value!);
  }

  /**
   * Handles errors that occur during the execution of the add/update team dialog.
   * @param error - The error that occurred.
   */
  handleError(error: any): void {
    console.log(error);
    switch (error.status) {
      case 409: // Already exists
        this.formControlTeamName.setErrors({ nameAlreadyExists: true });
        console.log('Team name already exists');
        break;
      default:
        console.log('This error is not handled: ', error);
        break;
    }
  }
}
