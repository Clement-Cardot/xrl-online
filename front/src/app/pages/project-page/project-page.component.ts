import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewContainerRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CompareDialogComponent } from "src/app/components/dialogs/compare-dialog/compare-dialog.component";
import { CreateModifyAssessmentDialogComponent } from "src/app/components/dialogs/create-modify-assessment-dialog/create-modify-assessment-dialog.component";
import { DeleteObjectDialogComponent } from "src/app/components/dialogs/delete-object-dialog/delete-object-dialog.component";
import { InfoDescriptionRlRankComponent } from "src/app/components/dialogs/info-description-rl-rank/info-description-rl-rank.component";
import { InfoMemberTeamComponent } from "src/app/components/dialogs/info-member-team/info-member-team.component";
import { LinearGraphComponent } from "src/app/components/graphs/linear-graph/linear-graph.component";
import { XrlGraphOptions } from "src/app/components/graphs/xrl-graph-options";
import { XrlGraphComponent } from "src/app/components/graphs/xrl-graph/xrl-graph.component";
import { AssessmentModel, Tag } from "src/app/core/data/models/assessment.model";
import { ProjectReport } from "src/app/core/data/models/project-report";
import { ProjectModel } from "src/app/core/data/models/project.model";
import { ReadinessLevelRankModel } from "src/app/core/data/models/readiness-level-rank.model";
import { UserModel } from "src/app/core/data/models/user.model";
import { ApiFileService } from "src/app/core/services/api-files.service";
import { ApiProjectService } from "src/app/core/services/api-project.service";
import { CurrentUserService } from "src/app/core/services/current-user.service";
import { LoadingService } from "src/app/core/services/loading-service";


@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {

  @ViewChild("graphToDownload") linearChart!: XrlGraphComponent;

  id!: string;
  project!: ProjectModel;

  assessmentIndex!: number;

  currentUser: UserModel | undefined;

  readinessLevelName: string | undefined;
  readinessLevelRank!: ReadinessLevelRankModel;

  graphOptions: XrlGraphOptions = {
    download: true,
    labelsClick: true,
  }

  constructor(
    private route: ActivatedRoute,
    private apiProjectService: ApiProjectService,
    public dialog: MatDialog,
    private apiFileService: ApiFileService,
    private currentUserService: CurrentUserService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.apiProjectService.getProjectById(this.id).subscribe({
      next: (v) => {
        this.project = v;
        this.assessmentIndex = this.project.assessments.length - 1;
        if (this.project.getLastAssessment() != null) {
          this.setReadinessLevelRank(this.project.getLastAssessment()?.readinessLevelRanks[0].readinessLevel.name!);
        }
      },
      error: (err) => console.error(err),
    });
    this.currentUser = this.currentUserService.getCurrentUser().getValue();
  }

  setReadinessLevel(rl: string) {
    // 2 next line are needed to update the view when click on rl after refresh linear graph
    this.readinessLevelName = "";
    this.changeDetectorRef.detectChanges();
    this.readinessLevelName = rl;
    this.setReadinessLevelRank(rl);
    this.changeDetectorRef.detectChanges();
  }

  setReadinessLevelRank(rl: string) {
    const readinessLevel = this.project.assessments[this.assessmentIndex]?.readinessLevelRanks.find((rlr) => rlr.readinessLevel.name == rl);
    this.readinessLevelRank = new ReadinessLevelRankModel(readinessLevel?.readinessLevel!, readinessLevel?.rank!, readinessLevel?.comment!);
  }

  getRlComment(): string {
    const assessment = this.project.assessments[this.assessmentIndex];
    return assessment.readinessLevelRanks.find((rlr) => rlr.readinessLevel.name == this.readinessLevelName)?.comment || '';
  }

  handlePaginatorEvent($event: PageEvent) {
    this.assessmentIndex = $event.pageIndex;
    if (this.readinessLevelName!)
      this.setReadinessLevelRank(this.readinessLevelName!);
    else
      this.setReadinessLevelRank(this.project.getLastAssessment()?.readinessLevelRanks[0].readinessLevel.name!);
  }

  openNewAssessmentDialog() {
    let data: AssessmentModel | null = this.project.getLastAssessment();
    if (data?.tag == Tag.INITIAL) {
      data.tag = Tag.INTERMEDIATE;
    }
    let dialog = this.dialog.open(
      CreateModifyAssessmentDialogComponent,
      {
        autoFocus: false,
        data: this.project.getLastAssessment(),
        disableClose: true
      },
    )
    dialog.afterClosed().subscribe((newAssessment) => {
      if (newAssessment instanceof AssessmentModel) {
        newAssessment.date = new Date(Date.now());
        this.apiProjectService.addNewAssessment(this.project.id, newAssessment).subscribe({
          next: (v) => {
            this.project = v;
            this.assessmentIndex = this.project.assessments.length - 1;
            this.setReadinessLevel(this.project.getLastAssessment()?.readinessLevelRanks[0].readinessLevel.name!);
            this.setReadinessLevelRank(this.project.getLastAssessment()?.readinessLevelRanks[0].readinessLevel.name!);
            this.snackBar.open(
              this.translateService.instant('ASSESSMENT.CREATE_ASSESSMENT_SUCCESS'),
              this.translateService.instant('ACTION.CLOSE'),
              {
                duration: 3000,
              }
            );
            this.changeDetectorRef.detectChanges();
          },
          error: (err) => console.error(err),
        });
      }
    });
  }

  async downloadReport(fileType: "PDF" | "WORD" | "PPTX") {
    const lastAssessment = this.project.getLastAssessment();
    if (!lastAssessment) return;
    try {
      this.loadingService.show();
      const imgPng = await this.getRadarGraphData(lastAssessment, {});
      let projectReport;
      if (this.project.assessments.length > 1) {
        const linearGraphs: { [key: string]: string } = {};
        for (let assessmentName of lastAssessment.readinessLevelRanks.map(rlr => rlr.readinessLevel.name) || []) {
          const linearGraph = await this.getLinearGraphData({legend: false}, assessmentName);
          linearGraphs[assessmentName] = linearGraph;
        }
        const compareOptions: XrlGraphOptions = {
          legend: true,
          legendPosition: "right"
        }
        const compareWithInitialGraph = await this.getRadarGraphData(lastAssessment, compareOptions, this.project.getFirstAssessment()!, );
        const compareTwoLastGraphs = await this.getRadarGraphData(lastAssessment, compareOptions, this.project.getSortedAssessments()[this.project.assessments.length - 2]);
        const completeLinearGraph = await this.getLinearGraphData({});

        projectReport = new ProjectReport(imgPng!, linearGraphs, completeLinearGraph, compareWithInitialGraph, compareTwoLastGraphs);
      } else {
        projectReport = new ProjectReport(imgPng!);
      }

      await this.apiFileService.triggerDownload(fileType, this.project, projectReport);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.hide();
    }
  }

  getRadarGraphData(assessment: AssessmentModel, options: XrlGraphOptions, compareAssessment?: AssessmentModel): Promise<string | undefined> {
    return new Promise((resolve) => {
      const radarGraph = this.viewContainerRef.createComponent(XrlGraphComponent);
      radarGraph.instance.assessment = assessment;
      radarGraph.instance.compareAssessment = compareAssessment;
      options.isDownloadOnlyUse = true;
      radarGraph.instance.options = options;

      const componentReadySubscription = radarGraph.instance.componentReady$.subscribe(() => {
        const pngImage = radarGraph.instance.getPngImage();

        this.viewContainerRef.remove(this.viewContainerRef.indexOf(radarGraph.hostView));
        resolve(pngImage);
        componentReadySubscription.unsubscribe();
      });
    });
  }

  getLinearGraphData(options: XrlGraphOptions, assessmentName?: string): Promise<string> {
    return new Promise((resolve) => {
      const linearGraph = this.viewContainerRef.createComponent(LinearGraphComponent);
      linearGraph.instance.assessments = this.project.assessments;
      options.isDownloadOnlyUse = true;
      linearGraph.instance.options = options;
      linearGraph.instance.rlName = assessmentName;

      const componentReadySubscription = linearGraph.instance.componentReady$.subscribe(() => {
        const pngImage = linearGraph.instance.getPngImage();

        this.viewContainerRef.remove(this.viewContainerRef.indexOf(linearGraph.hostView));
        resolve(pngImage);
        componentReadySubscription.unsubscribe();
      });
    });
  }



  openModifyAssessmentDialog() {
    let dialog = this.dialog.open(
      CreateModifyAssessmentDialogComponent,
      {
        autoFocus: false,
        data: this.project.assessments[this.assessmentIndex],
        disableClose: true
      },
    )
    dialog.afterClosed().subscribe((modifiedAssessment) => {
      if (modifiedAssessment instanceof AssessmentModel) {
        this.apiProjectService.modifyLastAssessment(this.project.id, modifiedAssessment).subscribe({
          next: (v) => {
            this.project = v;
            this.assessmentIndex = this.project.assessments.length - 1;
            this.setReadinessLevel(this.project.getLastAssessment()?.readinessLevelRanks[0].readinessLevel.name!);
            this.setReadinessLevelRank(this.project.getLastAssessment()?.readinessLevelRanks[0].readinessLevel.name!);
            this.snackBar.open(
              this.translateService.instant('ASSESSMENT.UPDATE_ASSESSMENT_SUCCESS'),
              this.translateService.instant('ACTION.CLOSE'), 
              {
                duration: 3000,
              }
            );
          },
          error: (err) => console.error(err),
        });
      }
    });
  }

  openCompareDialog(){
    this.dialog.open(
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
    return this.project.assessments[this.assessmentIndex].draft;
  }

  isLastAssessment(): boolean {
    if (this.project.assessments.length == 0 || this.assessmentIndex == this.project.assessments.length - 1) {
      return true;
    }
    return false;
  }

  modifyAssessmentComment() {

    const comment = (document.getElementById("lastAssessmentComment")! as HTMLTextAreaElement).value;

    const data: string[] = [this.assessmentIndex.toString(), comment];

    this.apiProjectService.modifyAssessmentComment(this.project.id, data).subscribe({
      next: (v) => {
        this.project.assessments[this.assessmentIndex].comment = comment;
      }
    });
    this.snackBar.open(this.translateService.instant('ASSESSMENT.UPDATE_COMMENT_SUCCESS'), this.translateService.instant('ACTION.CLOSE'), {
      duration: 3000
    });
  }

  isCreateButtonDisabled(): string | null {
    if (!this.isInTeam()) {
      return this.translateService.instant('ASSESSMENT.MANAGE_ASSESSMENT_NOT_IN_TEAM');
    }
    if (this.isDraft() || !this.isLastAssessment()) {
      return this.translateService.instant('ASSESSMENT.CREATE_ASSESSMENT_FAILURE');
    }
    if (this.project.getLastAssessment()?.tag == 'FINAL') {
      return this.translateService.instant('ASSESSMENT.CREATE_ASSESSMENT_FINAL_FAILURE');
    }
    if (this.project.getLastAssessment()?.date.toDateString() === new Date().toDateString()) {
      return this.translateService.instant('ASSESSMENT.CREATE_ASSESSMENT_ALREADY_EXIST_FOR_THIS_DATE');
    }
    return null;
  }

  isModifyButtonDisabled(): string | null {
    if (!this.isInTeam()) {
      return this.translateService.instant('ASSESSMENT.MANAGE_ASSESSMENT_NOT_IN_TEAM');
    }
    if (!this.isDraft()) {
      return this.translateService.instant('ASSESSMENT.UPDATE_ASSESSMENT_FAILURE');
    }
    return null;
  }

  isDeleteButtonDisabled(): boolean {
    return this.assessmentIndex == 0;
  }

  openInfoDescriptionRlRankDialog() {
    this.dialog.open(
      InfoDescriptionRlRankComponent,
      {
        autoFocus: false,
        data: {
          readinessLevelRank: this.readinessLevelRank
        },
      },
    )
  }

  openInfoMemberTeam() {
    this.dialog.open(
      InfoMemberTeamComponent, 
      {
        autoFocus: false,
        data: {
          members: this.project.team.members
        },
      }, 
    )
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteObjectDialogComponent, {
      data: {
        title: 'ASSESSMENT.DELETE_CONFIRM',
        content: this.project.assessments[this.assessmentIndex].date.toLocaleDateString(),
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiProjectService
          .deleteAssessment(this.project.id, this.project.assessments[this.assessmentIndex])
          .subscribe({
            next: (v) => {
              this.snackBar.open(
                this.translateService.instant('ASSESSMENT.DELETE_SUCCESS'),
                this.translateService.instant('ACTION.CLOSE'),
                {
                  duration: 3000,
                }
              );
              this.project.assessments.splice(this.assessmentIndex, 1);
              this.assessmentIndex--;
            },
            error: (e) => console.error(e),
          });
      }
    });
  }

  updateAssessmentDraft(isDraftChecked: boolean) {
    this.project.assessments[this.assessmentIndex].draft = isDraftChecked;
    this.apiProjectService.updateProject(this.project).subscribe({
      next: (v) => {
        this.project = v;
      }
    });
  }
}
