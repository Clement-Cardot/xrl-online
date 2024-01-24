import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReadinessLevelRankModel } from 'src/app/core/data/models/readiness-level-rank.model';

@Component({
  selector: 'app-info-description-rl-rank',
  templateUrl: './info-description-rl-rank.component.html',
  styleUrls: ['./info-description-rl-rank.component.scss']
})
export class InfoDescriptionRlRankComponent {

  readinessLevelRank!: ReadinessLevelRankModel;

  displayedColumns: string[] = ['longDescription'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { readinessLevelRank: ReadinessLevelRankModel }
  ) {
    this.readinessLevelRank = this.data.readinessLevelRank;
  }

}
