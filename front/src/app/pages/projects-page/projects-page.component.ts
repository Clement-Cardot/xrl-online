import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ProjectFormDialogComponent } from 'src/app/components/dialogs/project-form-dialog/project-form-dialog.component';
import { ProjectModel } from 'src/app/core/data/models/project.model';
import { UserModel } from 'src/app/core/data/models/user.model';
import { ApiProjectService } from 'src/app/core/services/api-project.service';
import { CurrentUserService } from 'src/app/core/services/current-user.service';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit {

  projects: ProjectModel[] = [];
  projectsToDisplay: ProjectModel[] = [];
  currentUser: UserModel | undefined;

  searchTypes: {typeValue: string, typeTranslation: string}[] = [
    {typeValue: 'name', typeTranslation: 'OBJECT.NAME'},
    {typeValue: 'team', typeTranslation: 'OBJECT.TEAM'},
    {typeValue: 'business-line', typeTranslation: 'OBJECT.BUSINESS_LINE'}
  ];

  constructor(
    private projectService: ApiProjectService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private currentUserService: CurrentUserService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.currentUserService.getCurrentUser().getValue();
    this.projectService.getAllProjects().subscribe({
      next: (v) => {
        this.projects = v;
        this.projectsToDisplay = v;
      },
      error: (err) => console.error(err),
    });
  }

  deleteProject(project: ProjectModel) {
    this.projectsToDisplay = this.projectsToDisplay.filter(
      (p) => p.id != project.id
    );
  }

  updateProjectsToDisplay(options: any) {

    let projectsCheckboxed = this.projects;

    if (options.checkbox) {
      projectsCheckboxed = this.projects.filter((p) => p.team.members.some((m) => m.id === this.currentUser?.id));
    }

    if (options.filterValue == null || options.filterValue == '') {
      this.projectsToDisplay = projectsCheckboxed;
      return;
    }

    switch (options.searchType) {
      case 'name':
        this.projectsToDisplay = projectsCheckboxed.filter((p) => this._fcs(p.name).includes(this._fcs(options.filterValue ?? '')));
        break;
      case 'team':
        this.projectsToDisplay = projectsCheckboxed.filter((p) => this._fcs(p.team.name).includes(this._fcs(options.filterValue ?? '')));
        break;
      case 'business-line':
        this.projectsToDisplay = projectsCheckboxed.filter((p) => this._fcs(p.businessLine.name).includes(this._fcs(options.filterValue ?? '')));
        break;
      default:
        this.projectsToDisplay = projectsCheckboxed;
        break;
    }
  }

  // Remove accents and lowercase string
  private _fcs(value: string): string {
    value = value.toLowerCase();
    value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return value;
  }

  openAddProjectDialog() {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      data: {
        title: 'PROJECT.CREATE_TITLE',
        save: 'ACTION.CREATE',
        currentUser: this.currentUser,
        isCreate: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectsToDisplay.push(result);
      }
    });
  }

}
