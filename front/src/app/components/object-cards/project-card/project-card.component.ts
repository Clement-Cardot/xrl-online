import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModel } from 'src/app/core/data/models/project.model';
import { ProjectFormDialogComponent } from '../../dialogs/project-form-dialog/project-form-dialog.component';
import { ApiProjectService } from 'src/app/core/services/api-project.service';
import { DeleteObjectDialogComponent } from '../../dialogs/delete-object-dialog/delete-object-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUserService } from 'src/app/core/services/current-user.service';
import { UserModel } from 'src/app/core/data/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

  @Input() project!: ProjectModel;
  @Output() deleteProjectEvent = new EventEmitter<ProjectModel>();

  isFront: boolean = true;
  currentUser: UserModel | undefined;

  state: string = "default";

  toggleProperty = false;
  
  
  constructor(
    private dialog: MatDialog,
    public router: Router,
    private snackBar: MatSnackBar,
    private projectService: ApiProjectService,
    private currentUserService: CurrentUserService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.currentUserService.getCurrentUser().getValue();
  }

  getDescription() : string {
    if (this.project.description.length == 0) {
      return this.translateService.instant('PROJECT.NO_DESCRIPTION');
    }
    return this.project.description;
  }

  getDateTextField() : string {
    const lastAssessment = this.project.getLastAssessment();
    if (lastAssessment == null) {
      return this.translateService.instant('ASSESSMENT.NO_ASSESSMENT');
    }
    
    return this.project.formatDate(lastAssessment.date);
  }

  openUpdateDialog() {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      data: {
        title: 'PROJECT.UPDATE_TITLE',
        save: 'ACTION.SAVE',
        project: this.project,
        currentUser: this.currentUser,
        isCreate: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.project = result;
      }
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteObjectDialogComponent, {
      data: {
        title: 'PROJECT.DELETE_CONFIRM',
        content: this.project.name
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(this.project).subscribe({
          next: (v) => {
            this.deleteProjectEvent.emit(v);
            this.snackBar.open(this.translateService.instant('PROJECT.DELETE_SUCCESS'), this.translateService.instant('ACTION.CLOSE'), {
              duration: 3000,
            });
          },
          error: (e) => console.error(e)
        });
      }
    });
  }

  cardClicked() {
    if (this.state === "default") {
      this.state = "flipped";
    } else {
      this.state = "default";
    }
  }

  toggle() {
    this.toggleProperty = !this.toggleProperty;
  }

  isUserLinkedToProject() : boolean {
    for (const member of this.project.team.members) {
      if (member.id === this.currentUser?.id) {
        return true;
      }
    }
    return false;
  }
}
