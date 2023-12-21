import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ReadinessLevelDialogComponent } from 'src/app/components/dialogs/readiness-level-dialog/readiness-level-dialog.component';
import { ReadinessLevelModel } from 'src/app/core/data/models/readiness-level.model';
import { ApiReadinessLevelService } from 'src/app/core/services/api-readiness-level.service';

@Component({
  selector: 'app-admin-readiness-level-page',
  templateUrl: './admin-readiness-level-page.component.html',
  styleUrls: ['./admin-readiness-level-page.component.scss'],
})
export class AdminReadinessLevelPageComponent implements OnInit {
  readinessLevels: ReadinessLevelModel[] = [];
  readinessLevelsToDisplay: ReadinessLevelModel[] = [];

  displayOptions: any = { filterValue: '', searchType: 'name' };

  searchTypes: { typeValue: string; typeTranslation: string }[] = [
    { typeValue: 'name', typeTranslation: 'READINESS_LEVEL.SEARCH_NAME' },
  ];

  constructor(
    private apiReadinessLevelService: ApiReadinessLevelService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.apiReadinessLevelService.getAllReadinessLevels().subscribe({
      next: (v) => {
        this.readinessLevels = v;
        this.readinessLevelsToDisplay = v;
      },
      error: (err) => console.log(err),
    });
  }

  addReadinessLevel(readinessLevel: ReadinessLevelModel) {
    this.readinessLevelsToDisplay.push(readinessLevel);
  }

  updateReadinessLevel(readinessLevel: ReadinessLevelModel) {
    const index = this.readinessLevels.findIndex(
      (t) => t.id == readinessLevel.id
    );
    this.readinessLevels[index] = readinessLevel;
  }

  deleteReadinessLevel(readinessLevel: ReadinessLevelModel) {
    this.readinessLevelsToDisplay = this.readinessLevelsToDisplay.filter(
      (t) => t.id != readinessLevel.id
    );
  }

  addReadinessLevelDialog() {
    const dialogRef = this.dialog.open(ReadinessLevelDialogComponent, {
      autoFocus: false,
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .subscribe(({ action: action, result: readinessLevel }) => {
        if (action == 'add') {
          this.addReadinessLevel(readinessLevel);
        }
      });
  }

  updateReadinessLevelDialog(readinessLevel: ReadinessLevelModel) {
    const dialogRef = this.dialog.open(ReadinessLevelDialogComponent, {
      data: readinessLevel,
      autoFocus: false,
    });
    dialogRef
      .afterClosed()
      .subscribe(({ action: action, result: readinessLevel }) => {
        if (action == 'update') {
          this.updateReadinessLevel(readinessLevel);
        } else if (action == 'delete') {
          this.deleteReadinessLevel(readinessLevel);
        }
      });
  }

  updateReadinessLevelToDisplay(options: any) {
    if (options.filterValue == null || options.filterValue == '') {
      this.readinessLevelsToDisplay = this.readinessLevels;
      return;
    }
    switch (options.searchType) {
      case 'name':
        this.readinessLevelsToDisplay = this.readinessLevels.filter((bl) =>
          this._fcs(bl.name).includes(this._fcs(options.filterValue ?? ''))
        );
        break;
      default:
        this.readinessLevelsToDisplay = this.readinessLevels;
        break;
    }
  }

  // Remove accents and lowercase string
  private _fcs(value: string): string {
    value = value.toLowerCase();
    value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return value;
  }
}
