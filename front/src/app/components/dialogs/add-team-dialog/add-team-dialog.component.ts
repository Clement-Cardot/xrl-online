import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamModel } from '../../../core/data/models/team.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-team-dialog',
  templateUrl: './add-team-dialog.component.html',
  styleUrls: ['./add-team-dialog.component.scss'],
})
export class AddTeamDialogComponent implements OnInit {
  createTeamForm!: FormGroup;
  formControlName!: FormControl;

  constructor(
    private dialogRef: MatDialogRef<AddTeamDialogComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.formControlName = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]);
    this.createTeamForm = this.formBuilder.group({
      name: this.formControlName,
    });
  }

  getNameErrorMessage(): string {
    if (this.formControlName.hasError('required')) {
      return this.translate.instant('TEAM.NAME_REQUIRED');
    }
    if (this.formControlName.hasError('minlength')) {
      return this.translate.instant('TEAM.NAME_MIN_LENGTH');
    }
    if (this.formControlName.hasError('maxlength')) {
      return this.translate.instant('TEAM.NAME_MAX_LENGTH');
    }
    return '';
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveTeam() {
    this.dialogRef.close(this.formControlName.value);
  }
}
