import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CreateAssessmentDialogComponent } from 'src/app/components/dialogs/create-assessment-dialog/create-assessment-dialog.component';
import { AssessmentModel } from 'src/app/core/data/models/assessment.model';
import { ProjectModel } from 'src/app/core/data/models/project.model';
import { UserModel } from 'src/app/core/data/models/user.model';
import { ApiProjectService } from 'src/app/core/services/api-project.service';
import { CurrentUserService } from 'src/app/core/services/current-user.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {

  id!: string;
  project!: ProjectModel;

  assessmentIndex!: number;

  constructor(
    private route: ActivatedRoute,
    private apiProjectService: ApiProjectService,
    private currentUserService: CurrentUserService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.apiProjectService.getProjectById(this.id).subscribe({
      next: (v) => {
        this.project = v;
        this.assessmentIndex = this.project.assessments.length - 1;
      },
      error: (err) => console.log(err), // TODO: handle error (404 not found)
    });
  }

  handlePaginatorEvent($event: PageEvent) {
    this.assessmentIndex = $event.pageIndex;
  }

  openNewAssessmentDialog() {
    let dialog = this.dialog.open(
      CreateAssessmentDialogComponent, 
      {
        autoFocus: false,
        data: this.project.getLastAssesment(), 
        disableClose: true 
      }, 
    )
    dialog.afterClosed().subscribe((newAssessment) => {
      if (newAssessment instanceof AssessmentModel) {
        this.apiProjectService.addNewAssessment(this.project.id, newAssessment).subscribe({
          next: (v) => {
            this.project = v;
            this.assessmentIndex = this.project.assessments.length - 1;
            this.snackBar.open(
              this.translateService.instant('PROJECTS.ASSESSMENT_ADDED'),
              this.translateService.instant('CLOSE'), 
              {
                duration: 3000,
              }
            );
          },
          error: (err) => console.log(err), // TODO: handle error (404 not found)
        });
      }
    });
  }

  isInTeam(): boolean {
    let user: UserModel | undefined = this.currentUserService.getCurrentUser().value;

    if (!user) {
      return false;
    }

    for (let member of this.project.team.members as unknown as UserModel[]) {
      if (member.id == user.id) {
        return true;
      }
    }

    return false;
  }

  isLastAssessment(): boolean {
    return this.assessmentIndex == this.project.assessments.length - 1;
  }

  modifyLastAssesmentComment() {

    const comment = (document.getElementById("lastAssessmentComment")! as HTMLTextAreaElement).value;

    this.apiProjectService.modifyLastAssesmentComment(this.project.id, comment).subscribe({
      next: (v) => {
        this.project = v;
      }
    });
    this.snackBar.open(this.translateService.instant('PROJECTS.ASSESSMENT_COMMENT_CHANGED'), this.translateService.instant('ACTION.CLOSE'), {
      duration: 3000
    });
  }


}
