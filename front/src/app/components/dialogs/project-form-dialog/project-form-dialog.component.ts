import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, startWith } from 'rxjs';
import { BusinessLineModel } from 'src/app/core/data/models/business-line';
import { ProjectModel } from 'src/app/core/data/models/project.model';
import { TeamModel } from 'src/app/core/data/models/team.model';
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

  editProjectForm!: FormGroup;
  nameFormControl!: FormControl;
  descriptionFormControl!: FormControl;
  teamFormControl!: FormControl;
  businessLineFormControl!: FormControl;

  teams: TeamModel[] = [];
  businessLines: BusinessLineModel[] = [];

  filteredTeams!: Observable<TeamModel[]>;
  filteredBusinessLines!: Observable<BusinessLineModel[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, save: string, project?: ProjectModel },
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
  }

  ngOnInit(): void {
    this.nameFormControl = new FormControl(this.project?.name, [Validators.required]);
    this.descriptionFormControl = new FormControl(this.project?.description);
    this.teamFormControl = new FormControl(this.project?.team, [Validators.required]);
    this.businessLineFormControl = new FormControl(this.project?.businessLine, [Validators.required]);
    this.editProjectForm  =  this.formBuilder.group({
      nameFormControl: this.nameFormControl,
      descriptionFormControl: this.descriptionFormControl,
      teamFormControl: this.teamFormControl,
      businnessLineFormControl: this.businessLineFormControl,
    });

    this.teamService.getAllTeams().subscribe({
      next: (v) => {
        this.teams = v;
        this.filteredTeams = this.teamFormControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTeam(value))
        );
      },
      error: (err) => console.log(err),
    });

    this.businessLineService.getAllBusinessLines().subscribe({
      next: (v) => {
        this.businessLines = v;
        this.filteredBusinessLines = this.businessLineFormControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterBusinessLine(value))
        );
      },
      error: (err) => console.log(err),
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
    && this.teamFormControl.value != "" && this.teamFormControl.value != null
    && !(this.teams.some(team => team.name === this.teamFormControl.value))) {
      this.teamFormControl.setErrors({ teamNotExists: true });
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
        [],
      );

      if (this.project) {
        this.projectService.updateProjectWithoutAssesments(project).subscribe({
          next: (v) => {
            this.project = v;
            this.snackBar.open(this.translateService.instant('PROJECTS.UPDATE_SUCCESS'), 'OK', {
              duration: 3000,
            });
            this.dialogRef.close(v);         
          },
          error: (e) => {
            if (e.status == 409) {
              this.nameFormControl.setErrors({projectNameAlreadyExists: true});
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
            this.snackBar.open(this.translateService.instant('PROJECTS.CREATE_SUCCESS'), 'OK', {
              duration: 3000,
            });
            this.dialogRef.close(v);         
          },
          error: (e) => {
            if (e.status == 409) {
              this.nameFormControl.setErrors({projectNameAlreadyExists: true});
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
      return this.translateService.instant('PROJECTS.NAME_REQUIRED');
    }
    if (this.nameFormControl.hasError('projectNameAlreadyExists')) {
      return this.translateService.instant('PROJECTS.NAME_ALREADY_EXISTS');
    }
    return '';
  }

  getTeamErrorMessage() {
    if (this.teamFormControl.hasError('required')) {
      return this.translateService.instant('PROJECTS.TEAM_REQUIRED');
    }
    if (this.teamFormControl.hasError('teamNotExists')) {
      return this.translateService.instant('PROJECTS.TEAM_NOT_EXISTS');
    }
    return '';
  }

  getBusinessLineErrorMessage() {
    if (this.businessLineFormControl.hasError('required')) {
      return this.translateService.instant('PROJECTS.BUSINESS_LINE_REQUIRED');
    }
    if (this.businessLineFormControl.hasError('businessLineNotExists')) {
      return this.translateService.instant('PROJECTS.BUSINESS_LINE_NOT_EXISTS');
    }
    return '';
  }

}
