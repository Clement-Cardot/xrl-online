import { ChangeDetectorRef, Component } from '@angular/core';
import { AssessmentAdapter } from 'src/app/core/data/models/assessment.model';
import { ReadinessLevelRankModel } from 'src/app/core/data/models/readiness-level-rank.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  readinessLevelRank!: ReadinessLevelRankModel;

  constructor(
    private assessmentAdapter: AssessmentAdapter,
    private changeDetectorRef: ChangeDetectorRef // Inject ChangeDetectorRef
    ) { }

  ngOnInit(): void {
  }
}
