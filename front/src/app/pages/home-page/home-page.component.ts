import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AssessmentModel, Tag } from 'src/app/core/data/models/assessment.model';
import { ReadinessLevelRankModel } from 'src/app/core/data/models/readiness-level-rank.model';
import { ReadinessLevelModel } from 'src/app/core/data/models/readiness-level.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private dialogRef: MatDialog
  ) { 
    this.assessment = {
      tag: Tag.INITIAL,
      date: new Date(),
      draft: false,
      comment: '',
      readinessLevelRanks: this.getReadinessLevelRank()
    };
    setInterval(() => {
      this.index = (this.index + 1) % 3;
      this.assessment = {
        tag: Tag.INITIAL,
        date: new Date(),
        draft: false,
        comment: '',
        readinessLevelRanks: this.getReadinessLevelRank()
      };
    }, 4000);
  }

  ngOnInit(): void {
    if (this.router.url.includes('session-expired')) {
      this.dialogRef.closeAll();
      this.snackBar.open(this.translateService.instant('HOME.EXPIRED_SESSION'), this.translateService.instant('ACTION.CLOSE'), {
        duration: 5000,
      });
    }
  }

  switchPage(url: string): void {
    this.router.navigateByUrl(url);
  }

  public assessment!: AssessmentModel;
  private index: number = 0;
  private ranks: number[][] = [
    [8, 6, 6, 7, 5, 9],
    [7, 7, 5, 6, 5, 8],
    [7, 5, 7, 6, 4, 7],
  ]

  ngAfterViewInit(): void {
    (document.querySelector("app-xrl-graph div") as HTMLElement).style.height = "100%";
  }

  getReadinessLevelRank(): ReadinessLevelRankModel[] {
    return [
      {
        readinessLevel: this.customer,
        rank: this.ranks[this.index][0],
        comment: ''
      },
      {
        readinessLevel: this.technology,
        rank: this.ranks[this.index][1],
        comment: ''
      },
      {
        readinessLevel: this.businessModel,
        rank: this.ranks[this.index][2],
        comment: ''
      },
      {
        readinessLevel: this.ipr,
        rank: this.ranks[this.index][3],
        comment: ''
      },
      {
        readinessLevel: this.team,
        rank: this.ranks[this.index][4],
        comment: ''
      },
      {
        readinessLevel: this.funding,
        rank: this.ranks[this.index][5],
        comment: ''
      }
    ];
  }

  private customer: ReadinessLevelModel = {
    id: '0',
    name: 'Customer',
    description: '',
    levels: [],
    isUsed: false
  };

  private technology: ReadinessLevelModel = {
    id: '1',
    name: 'Technology',
    description: '',
    levels: [],
    isUsed: false
  };

  private businessModel: ReadinessLevelModel = {
    id: '2',
    name: 'Business Model',
    description: '',
    levels: [],
    isUsed: false
  };

  private ipr: ReadinessLevelModel = {
    id: '3',
    name: 'IPR',
    description: '',
    levels: [],
    isUsed: false
  };

  private team: ReadinessLevelModel = {
    id: '4',
    name: 'Team',
    description: '',
    levels: [],
    isUsed: false
  };

  private funding: ReadinessLevelModel = {
    id: '5',
    name: 'Funding',
    description: '',
    levels: [],
    isUsed: false
  };
}
