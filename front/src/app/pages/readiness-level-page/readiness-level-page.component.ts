import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReadinessLevelRankModel } from 'src/app/core/data/models/readiness-level-rank.model';
import { ReadinessLevelModel } from 'src/app/core/data/models/readiness-level.model';
import { ApiReadinessLevelService } from 'src/app/core/services/api-readiness-level.service';

@Component({
  selector: 'app-readiness-level-page',
  templateUrl: './readiness-level-page.component.html',
  styleUrls: ['./readiness-level-page.component.scss']
})
export class ReadinessLevelPageComponent implements OnInit {

  readinessLevels: ReadinessLevelModel[] = [];
  readinessLevelRank!: ReadinessLevelRankModel;

  displayedColumns: string[] = ['readinessLevel'];

  constructor(
    private apiReadinessLevelService: ApiReadinessLevelService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.apiReadinessLevelService.getAllReadinessLevels().subscribe({
      next: (v) => {
        this.readinessLevels = v;
        this.readinessLevelRank = new ReadinessLevelRankModel(this.readinessLevels[0], 1, '');
      },
      error: (err) => console.error(err),
    });
  }

  updateReadinessLevelRank(newReadinessLevelRank: ReadinessLevelRankModel) {
    this.readinessLevelRank = newReadinessLevelRank;
    this.changeDetectorRef.detectChanges();
  }

  setReadinessLevel(id: string) {
    const readinessLevel = this.readinessLevels.find((rl: ReadinessLevelModel) => rl.id === id);
    if (readinessLevel) {
      this.readinessLevelRank = new ReadinessLevelRankModel(readinessLevel, this.readinessLevelRank.rank, '');
    }
  }

}
