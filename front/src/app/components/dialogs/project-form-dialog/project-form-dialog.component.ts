import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, startWith } from 'rxjs';
import { BusinessLineModel } from 'src/app/core/data/models/business-line';
import { ProjectModel } from 'src/app/core/data/models/project.model';
import { TeamModel } from 'src/app/core/data/models/team.model';
import { UserModel } from 'src/app/core/data/models/user.model';
import { ApiBusinessLineService } from 'src/app/core/services/api-business-line.service';
import { ApiProjectService } from 'src/app/core/services/api-project.service';
import { ApiTeamService } from 'src/app/core/services/api-team.service';

@Component({
  selector: 'app-project-form-dialog',
  templateUrl: './project-form-dialog.component.html',
  styleUrls: ['./project-form-dialog.component.scss']
})
export class ProjectFormDialogComponent implements OnInit {

  @Input() project?: ProjectModel
  @Input() title!: string;
  @Input() save!: string;
  @Input() currentUser!: UserModel;
  @Input() isCreate!: boolean;

  editProjectForm!: FormGroup;
  nameFormControl!: FormControl;
  descriptionFormControl!: FormControl;
  teamFormControl!: FormControl;
  businessLineFormControl!: FormControl;

  teams: TeamModel[] = [];
  businessLines: BusinessLineModel[] = [];

  // Only used in case of a Project Creation by a non-admin user
  allTeams: TeamModel[] = [];

  filteredTeams!: Observable<TeamModel[]>;
  filteredBusinessLines!: Observable<BusinessLineModel[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, save: string, project?: ProjectModel, currentUser: UserModel, isCreate: boolean },
    private dialogRef: MatDialogRef<ProjectFormDialogComponent>,
    private formBuilder: FormBuilder,
    private teamService: ApiTeamService,
    private businessLineService: ApiBusinessLineService,
    private translateService: TranslateService,
    private projectService: ApiProjectService,
    private snackBar: MatSnackBar,
  ) {
    this.project = data.project;
    this.title = data.title;
    this.save = data.save;
    this.currentUser = data.currentUser;
    this.isCreate = data.isCreate;
  }

  ngOnInit(): void {
    this.nameFormControl = new FormControl(this.project?.name, [Validators.required, Validators.maxLength(20), Validators.minLength(3)]);
    this.descriptionFormControl = new FormControl(this.project?.description, [Validators.maxLength(1000)]);
    this.teamFormControl = new FormControl(this.project?.team, [Validators.required]);
    this.businessLineFormControl = new FormControl(this.project?.businessLine, [Validators.required]);

    this.editProjectForm = this.formBuilder.group({
      nameFormControl: this.nameFormControl,
      descriptionFormControl: this.descriptionFormControl,
      teamFormControl: this.teamFormControl,
      businnessLineFormControl: this.businessLineFormControl,
    });

    if (this.currentUser.isAdmin()) {
      this.teamService.getAllTeams().subscribe({
        next: (v) => {
          this.teams = v;
          this.filteredTeams = this.teamFormControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterTeam(value))
          );
        },
        error: (err) => console.error(err),
      });
    }
    else {
      if (this.isCreate) {
        this.teamService.getAllTeams().subscribe({
          next: (v) => {
            this.allTeams = v;
            this.filteredTeams = this.teamFormControl.valueChanges.pipe(
              startWith(''),
              map(value => this._filterTeam(value))
            );
          },
          error: (err) => console.error(err),
        });
      }

      this.teamService.getTeamsByUserId(this.currentUser.id).subscribe({
        next: (v) => {
          this.teams = v;
          this.filteredTeams = this.teamFormControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterTeam(value))
          );
        },
        error: (err) => console.error(err),
      });

      if (!this.isCreate) {
        this.teamFormControl.disable();
      }

    }

    this.businessLineService.getAllBusinessLines().subscribe({
      next: (v) => {
        this.businessLines = v;
        this.filteredBusinessLines = this.businessLineFormControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterBusinessLine(value))
        );
      },
      error: (err) => console.error(err),
    });
  }

  private _filterTeam(value: any): TeamModel[] {
    const filterValue = (value instanceof TeamModel) ? value.name.toLowerCase() : value.toLowerCase();
    return this.teams.filter(team => team.name.toLowerCase().includes(filterValue));
  }

  private _filterBusinessLine(value: any): BusinessLineModel[] {
    const filterValue = (value instanceof Object) ? value.name.toLowerCase() : value.toLowerCase();
    return this.businessLines.filter(businessLine => businessLine.name.toLowerCase().includes(filterValue));
  }

  displayTeamFn(team: TeamModel): string {
    return team && team.name ? team.name : '';
  }

  displayBusinessLineFn(businessLine: BusinessLineModel): string {
    return businessLine && businessLine.name ? businessLine.name : '';
  }

  saveUser() {
    this.editProjectForm.markAllAsTouched();
    if (!(this.teamFormControl.value instanceof TeamModel)
      && this.teamFormControl.value != "" && this.teamFormControl.value != null) {

      if (this.currentUser.isAdmin()) {
        if (!(this.teams.some(team => team.name === this.teamFormControl.value))) {
          this.teamFormControl.setErrors({ teamNotExists: true });
        }
      }
      else {
        if (!(this.allTeams.some(team => team.name === this.teamFormControl.value))) {
          this.teamFormControl.setErrors({ teamNotExists: true });
        }
        else {
          if (!(this.teams.some(team => team.name === this.teamFormControl.value))) {
            this.teamFormControl.setErrors({ teamNotAllowed: true });
          }
        }
      }

    }
    if (!(this.businessLineFormControl.value instanceof Object)
      && this.businessLineFormControl.value != "" && this.businessLineFormControl.value != null
      && !(this.businessLines.some(businessLine => businessLine.name === this.businessLineFormControl.value))) {
      this.businessLineFormControl.setErrors({ businessLineNotExists: true });
    }
    if (!this.editProjectForm.invalid) {
      if (!(this.teamFormControl.value instanceof TeamModel)) {
        this.teamFormControl.setValue(this.teams.find(team => team.name === this.teamFormControl.value));
      }
      if (!(this.businessLineFormControl.value instanceof Object)) {
        this.businessLineFormControl.setValue(this.businessLines.find(businessLine => businessLine.name === this.businessLineFormControl.value));
      }
      const project: ProjectModel = new ProjectModel(
        this.project?.id ?? "",
        this.nameFormControl.value,
        this.descriptionFormControl.value,
        this.teamFormControl.value,
        this.businessLineFormControl.value,
        this.project?.assessments ?? [],
      );

      if (this.project) {
        this.projectService.updateProject(project).subscribe({
          next: (v) => {
            this.project = v;
            this.snackBar.open(this.translateService.instant('PROJECT.UPDATE_SUCCESS'), this.translateService.instant('ACTION.CLOSE'), {
              duration: 3000,
            });
            this.dialogRef.close(v);
          },
          error: (e) => {
            if (e.status == 409) {
              this.nameFormControl.setErrors({ projectNameAlreadyExists: true });
              this.nameFormControl.markAsTouched();
            } else {
              console.error(e);
            }
          }
        });
      } else {
        this.projectService.createProject(project).subscribe({
          next: (v) => {
            this.project = v;
            this.snackBar.open(this.translateService.instant('PROJECT.CREATE_SUCCESS'), this.translateService.instant('ACTION.CLOSE'), {
              duration: 3000,
            });
            this.dialogRef.close(v);
          },
          error: (e) => {
            if (e.status == 409) {
              this.nameFormControl.setErrors({ projectNameAlreadyExists: true });
              this.nameFormControl.markAsTouched();
            } else {
              console.error(e);
            }
          }
        });
      }

    }
  }

  getNameErrorMessage() {
    if (this.nameFormControl.hasError('required')) {
      return this.translateService.instant('PROJECT.NAME_REQUIRED');
    }
    if (this.nameFormControl.hasError('projectNameAlreadyExists')) {
      return this.translateService.instant('PROJECT.NAME_ALREADY_EXISTS');
    }
    if (this.nameFormControl.hasError('maxlength')) {
      return this.translateService.instant('PROJECT.NAME_MAX_LENGTH');
    }
    if (this.nameFormControl.hasError('minlength')) {
      return this.translateService.instant('PROJECT.NAME_MIN_LENGTH');
    }
    return '';
  }

  getTeamErrorMessage() {
    if (this.teamFormControl.hasError('required')) {
      return this.translateService.instant('PROJECT.TEAM_REQUIRED');
    }
    if (this.teamFormControl.hasError('teamNotExists')) {
      return this.translateService.instant('PROJECT.TEAM_NOT_EXISTS');
    }
    if (this.teamFormControl.hasError('teamNotAllowed')) {
      return this.translateService.instant('PROJECT.TEAM_NOT_ALLOWED');
    }
    return '';
  }

  getBusinessLineErrorMessage() {
    if (this.businessLineFormControl.hasError('required')) {
      return this.translateService.instant('PROJECT.BUSINESS_LINE_REQUIRED');
    }
    if (this.businessLineFormControl.hasError('businessLineNotExists')) {
      return this.translateService.instant('PROJECT.BUSINESS_LINE_NOT_EXISTS');
    }
    return '';
  }

  getDescriptionErrorMessage() {
    if (this.descriptionFormControl.hasError('maxlength')) {
      return this.translateService.instant('PROJECT.DESCRIPTION_MAX_LENGTH');
    }
    return '';
  }

}
