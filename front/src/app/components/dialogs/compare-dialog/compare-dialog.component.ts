import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssessmentModel } from 'src/app/core/data/models/assessment.model';
import { XrlGraphOptions } from '../../graphs/xrl-graph/xrl-graph.component';

@Component({
  selector: 'app-compare-dialog',
  templateUrl: './compare-dialog.component.html',
  styleUrls: ['./compare-dialog.component.scss']
})
export class CompareDialogComponent {

  compareFormControl = this._formBuilder.group({
    firstAssessmentControl: [''],
    secondAssessmentControl: [''],
    comparisonModeControl: ['overlay', Validators.required],
  });

  firstAssessment!: AssessmentModel;
  secondAssessment!: AssessmentModel;

  graphOptions: XrlGraphOptions = {
    legend: true,
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {assessments: AssessmentModel[], index: number},
    private _formBuilder: FormBuilder,
  ) {
    this.compareFormControl.controls['firstAssessmentControl'].setValue(this.data.assessments[this.data.index].date.toLocaleDateString());
    this.firstAssessment = this.data.assessments[this.data.index];
  }

  defineFirstAssessment(date: string) {
    this.firstAssessment = this.data.assessments.find((a: AssessmentModel) => a.date.toLocaleDateString() == date)!;
  }

  defineSecondAssessment(date: string) {
    this.secondAssessment = this.data.assessments.find((a: AssessmentModel) => a.date.toLocaleDateString() == date)!;
  }

  isAlreadySelected(field: number, date: Date): boolean {
    if (field == 1) {
      return this.secondAssessment?.date == date;
    }
    else {
      return this.firstAssessment?.date == date;
    }
  }
}
