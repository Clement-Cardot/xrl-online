import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModel } from 'src/app/core/data/models/project.model';
import { ProjectFormDialogComponent } from '../dialogs/project-form-dialog/project-form-dialog.component';
import { ApiProjectService } from 'src/app/core/services/api-project.service';
import { DeleteObjectDialogComponent } from '../dialogs/delete-object-dialog/delete-object-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUserService } from 'src/app/core/services/current-user.service';
import { UserModel } from 'src/app/core/data/models/user.model';

@Component({
  selector: 'app-project-item-list',
  templateUrl: './project-item-list.component.html',
  styleUrls: ['./project-item-list.component.scss']
})
export class ProjectItemListComponent implements OnInit {

  @Input() project!: ProjectModel;
  @Output() deleteProjectEvent = new EventEmitter<ProjectModel>();

  isFront: boolean = true;
  currentUser: UserModel | undefined;
  
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private projectService: ApiProjectService,
    private currentUserService: CurrentUserService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.currentUserService.getCurrentUser().getValue();
    if (!(this.currentUser && this.currentUser.isAdmin())) {
      Array.from(document.getElementsByClassName('project-actions-buttons')).forEach((element) => {
        element.setAttribute('style', 'display: none');
      });
    }
  }

  getDescription() : string {
    if (this.project.description.length == 0) {
      return this.translateService.instant('PROJECTS.NO_DESCRIPTION');
    }
    return this.project.description;
  }

  flipCard() {
    document.querySelector("#project-item-" + this.project.id)?.classList.toggle('flipped');
    this.isFront = !this.isFront;
    if (this.isFront) {
      document.querySelectorAll("#project-item-" + this.project.id + " .flip-front .project-hover-buttons").forEach((element) => {
        element.setAttribute('style', 'display: block');
      });
      if (!(this.currentUser && this.currentUser.isAdmin())) {
        Array.from(document.getElementsByClassName('project-actions-buttons')).forEach((element) => {
          element.setAttribute('style', 'display: none');
        });
      }
    } else {
      document.querySelectorAll("#project-item-" + this.project.id + " .flip-front .project-hover-buttons").forEach((element) => {
        element.setAttribute('style', 'display: none');
      });
    }
    //width without padding
    let frontWidth = document.querySelector("#project-item-" + this.project.id + " .flip-front")?.clientWidth
    if (frontWidth != undefined) frontWidth -= 48;
    document.querySelector("#project-item-" + this.project.id + " .flip-back")?.setAttribute('style', 'width: ' + frontWidth + 'px');
  }

  openUpdateDialog() {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      data: {
        title: 'PROJECTS.UPDATE',
        save: 'SAVE',
        project: this.project,
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
        title: 'PROJECTS.DELETE',
        content: this.project.name
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(this.project).subscribe({
          next: (v) => {
            this.deleteProjectEvent.emit(v);
            this.snackBar.open(this.translateService.instant('PROJECTS.DELETE_SUCCESS'), 'OK', {
              duration: 3000,
            });
          },
          error: (e) => console.error(e)
        });
      }
    });
  }
}
