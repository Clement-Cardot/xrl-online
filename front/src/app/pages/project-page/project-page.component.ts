import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CompareDialogComponent } from 'src/app/components/dialogs/compare-dialog/compare-dialog.component';
import { CreateModifyAssessmentDialogComponent } from 'src/app/components/dialogs/create-modify-assessment-dialog/create-modify-assessment-dialog.component';
import { XrlGraphOptions } from 'src/app/components/graphs/xrl-graph/xrl-graph.component';
import { AssessmentModel, Tag } from 'src/app/core/data/models/assessment.model';
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

  readinessLevelName: string | undefined;

  graphOptions: XrlGraphOptions = {
    download: true
  }

  constructor(
    private route: ActivatedRoute,
    private apiProjectService: ApiProjectService,
    private currentUserService: CurrentUserService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
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

  setReadinessLevel(rl: string) {
    this.readinessLevelName = rl;
    this.changeDetectorRef.detectChanges();
  }

  getRlComment(): string {
    const assesment = this.project.assessments[this.assessmentIndex];
    return assesment.readinessLevelRanks.find((rlr) => rlr.readinessLevel.name == this.readinessLevelName)?.comment || '';
  }

  handlePaginatorEvent($event: PageEvent) {
    this.assessmentIndex = $event.pageIndex;
  }

  openNewAssessmentDialog() {
    let dialog = this.dialog.open(
      CreateModifyAssessmentDialogComponent, 
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
              this.translateService.instant('ACTION.CLOSE'), 
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

  openModifyAssessmentDialog() {
    let dialog = this.dialog.open(
      CreateModifyAssessmentDialogComponent, 
      {
        autoFocus: false,
        data: this.project.getLastAssesment(), 
        disableClose: true 
      }, 
    )
    dialog.afterClosed().subscribe((modifiedAssessment) => {
      if (modifiedAssessment instanceof AssessmentModel) {
        this.apiProjectService.modifyLastAssessment(this.project.id, modifiedAssessment).subscribe({
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

  openCompareDialog(){
    let dialog = this.dialog.open(
      CompareDialogComponent, 
      {
        autoFocus: false,
        data: {
          assessments: this.project.assessments,
          index: this.assessmentIndex,
        },
      }, 
    )
  }

  isInTeam(): boolean {
    let user: UserModel | undefined = this.currentUserService.getCurrentUser().value;

    if (!user) {
      return false;
    }

    for (let member of this.project.team.members) {
      if (member.id == user.id) {
        return true;
      }
    }

    return false;
  }

  isDraft(): boolean {
    if (this.project.assessments.length == 0) {
      return false;
    }
    return this.project.getLastAssesment()?.tag == Tag.DRAFT;
  }

  isLastAssessment(): boolean {
    return (this.assessmentIndex == this.project.assessments.length - 1) && this.project.assessments.length > 0;
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

  isCreateButtonDisabled(): boolean {
    return !this.isInTeam() || this.isDraft();
  }

  isModifyButtonDisabled(): boolean {
    return !this.isInTeam() || !this.isDraft() || !this.isLastAssessment();
  }


}
