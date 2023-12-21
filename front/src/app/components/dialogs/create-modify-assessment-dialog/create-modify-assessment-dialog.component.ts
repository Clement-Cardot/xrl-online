import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatTable } from '@angular/material/table';
import { AssessmentModel, Tag } from 'src/app/core/data/models/assessment.model';
import { ReadinessLevelRankModel } from 'src/app/core/data/models/readiness-level-rank.model';
import { ReadinessLevelModel } from 'src/app/core/data/models/readiness-level.model';
import { ApiReadinessLevelService } from 'src/app/core/services/api-readiness-level.service';
import { XrlGraphOptions } from '../../graphs/xrl-graph/xrl-graph.component';

@Component({
  selector: 'app-create-modify-assessment-dialog',
  templateUrl: './create-modify-assessment-dialog.component.html',
  styleUrls: ['./create-modify-assessment-dialog.component.scss']
})
export class CreateModifyAssessmentDialogComponent implements OnInit {

  @ViewChild('matTableReadinessLevel') RLTable!: MatTable<ReadinessLevelModel>;
  @ViewChild('matTableSelectReadinessLevel') selectTable!: MatTable<ReadinessLevelModel>;
  @ViewChild('stepper') stepper!: MatStepper;

  public readinessLevels: ReadinessLevelModel[] = [];
  public selectedReadinessLevels: ReadinessLevelModel[] = [];

  public newAssessmentReadinessLevelRanks!: ReadinessLevelRankModel[];
  
  public newAssessment!: AssessmentModel;

  commentAndTagFormControl = this._formBuilder.group({
    commentControl: ['', Validators.required],
    tagControl: ['', Validators.required],
  });

  rankCommentFormControls: FormGroup[] = [];

  public formPage: number = 0;
  displayedColumns: string[] = ['readinessLevel', 'actions'];
  public isEditable: boolean = false;

  graphOptions: XrlGraphOptions = {
    legend: true,
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public lastAssessment: AssessmentModel,
    public dialogRef: MatDialogRef<CreateModifyAssessmentDialogComponent>,
    private changeDetectorRef: ChangeDetectorRef, // Inject ChangeDetectorRef
    private _formBuilder: FormBuilder,
    private apiReadinessLevelService: ApiReadinessLevelService,
  ) {
  }

  ngOnInit(): void {
    if (this.lastAssessment != null) {
      this.selectedReadinessLevels = this.lastAssessment.readinessLevelRanks.map((r: ReadinessLevelRankModel) => r.readinessLevel);
      this.commentAndTagFormControl.controls.commentControl.setValue(this.lastAssessment.comment);
      this.commentAndTagFormControl.controls.tagControl.setValue(this.lastAssessment.tag);
    }
    else {
      this.commentAndTagFormControl.controls.tagControl.setValue('INITIAL');
      this.commentAndTagFormControl.controls.tagControl.disable();
    }

    this.apiReadinessLevelService.getAllReadinessLevels().subscribe({
      next: (v) => {
        this.readinessLevels = v.filter((rl: ReadinessLevelModel) => !this.selectedReadinessLevels.map((srl: ReadinessLevelModel) => srl.id).includes(rl.id));
      },
      error: (err) => console.log(err), // TODO: handle error (404 not found)
    });

  }

  /**
 * Displays action buttons for a user.
 * @param user - The user to display the action buttons for.
 * @returns void
 */
  enterActionsButton(readinessLevel: ReadinessLevelModel) {
    document.getElementById('readiness-level-list-actions-' + readinessLevel.id)!.style.display =
      'block';
  }

  /**
   * Hide the action buttons for a user.
   * @param user - The user to hide the action buttons for.
   * @returns void
   */
  leaveActionsButton(readinessLevel: ReadinessLevelModel) {
    document.getElementById('readiness-level-list-actions-' + readinessLevel.id)!.style.display =
      'none';
  }

  addReadinessLevelToAssessment(readinessLevel: ReadinessLevelModel) {
    this.selectedReadinessLevels.push(readinessLevel);
    this.readinessLevels.splice(this.readinessLevels.indexOf(readinessLevel), 1);
    this.selectTable.renderRows();
    this.RLTable.renderRows();
  };

  removeReadinessLevelFromAssessment(readinessLevel: ReadinessLevelModel) {
    this.readinessLevels.push(readinessLevel);
    this.selectedReadinessLevels.splice(this.selectedReadinessLevels.indexOf(readinessLevel), 1);
    this.selectTable.renderRows();
    this.RLTable.renderRows();
  };

  submitReadinessLevelsSelection() {
    this.newAssessmentReadinessLevelRanks = this.selectedReadinessLevels.map((rl: ReadinessLevelModel) => {
      if (this.lastAssessment == null) {
        return new ReadinessLevelRankModel(rl, 0, "");
      }
      let lastAssessmentReadinessLevelRank = this.lastAssessment.readinessLevelRanks.find((rlr: ReadinessLevelRankModel) => rlr.readinessLevel.id === rl.id);
      if (lastAssessmentReadinessLevelRank == null) {
        return new ReadinessLevelRankModel(rl, 0, "");
      }
      return new ReadinessLevelRankModel(rl, lastAssessmentReadinessLevelRank.rank, lastAssessmentReadinessLevelRank.comment);
    });

    for (let readinessLevelRank of this.newAssessmentReadinessLevelRanks) {
      this.rankCommentFormControls.push(
        this._formBuilder.group({
          rankCommentControl: [readinessLevelRank.comment, Validators.required],
        })
      );
    }

    this.isEditable = true;
  }

  updateReadinessLevelRank(newReadinessLevelRank: ReadinessLevelRankModel) {
    this.newAssessmentReadinessLevelRanks[this.newAssessmentReadinessLevelRanks.indexOf(newReadinessLevelRank)] = newReadinessLevelRank;
    this.changeDetectorRef.detectChanges();
  }

  submitRankAndComment(index: number) {
    this.newAssessmentReadinessLevelRanks[index].comment = this.rankCommentFormControls[index].value.rankCommentControl;
  }

  createNewAssessment() {
    const tagControlValue = this.commentAndTagFormControl.controls.tagControl.value ?? '';
    const commentControlValue = this.commentAndTagFormControl.controls.commentControl.value ?? '';

    let tagValue: Tag = Tag[tagControlValue as keyof typeof Tag];

    this.newAssessment = new AssessmentModel(
      new Date(),
      tagValue, 
      commentControlValue, 
      this.newAssessmentReadinessLevelRanks
    );
  }
}
