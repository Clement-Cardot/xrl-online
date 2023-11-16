import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ProjectFormDialogComponent } from 'src/app/components/dialogs/project-form-dialog/project-form-dialog.component';
import { ProjectModel } from 'src/app/core/data/models/project.model';
import { ApiProjectService } from 'src/app/core/services/api-project.service';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit {

  projects: ProjectModel[] = [];
  projectsToDisplay: ProjectModel[] = [];

  searchType: string = "";
  projectControl = new FormControl('');

  constructor(
    private projectService: ApiProjectService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (v) => {
        this.projects = v;
        this.projectsToDisplay = v;
      },
      error: (err) => console.log(err),
    });
  }

  deleteProject(project: ProjectModel) {
    this.projects = this.projects.filter((p) => p.id !== project.id);
    this.projectsToDisplay = this.projectsToDisplay.filter((p) => p.id !== project.id);
  }

  clearSearchInput() {
    this.projectControl.setValue('');
    this.updateProjectsToDisplay();
  }

  updateProjectsToDisplay() {
    if (this.projectControl.value == null || this.projectControl.value == '') {
      this.projectsToDisplay = this.projects;
      return;
    }
    switch (this.searchType) {
      case 'name':
        this.projectsToDisplay = this.projects.filter((p) => this._fcs(p.name).includes(this._fcs(this.projectControl.value!)));
        break;
      case 'team':
        this.projectsToDisplay = this.projects.filter((p) => this._fcs(p.team.name).includes(this._fcs(this.projectControl.value!)));
        break;
      case 'business-line':
        this.projectsToDisplay = this.projects.filter((p) => this._fcs(p.businessLine.name).includes(this._fcs(this.projectControl.value!)));
        break;
      default:
        this.projectsToDisplay = this.projects;
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
        title: 'PROJECTS.CREATE',
        save: 'CREATE',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projects.push(result);
      }
    });
  }

}
