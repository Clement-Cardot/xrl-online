import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ReadinessLevelModel } from 'src/app/core/data/models/readiness-level.model';
import { ApiReadinessLevelService } from 'src/app/core/services/api-readiness-level.service';
import { ReadinessLevelDialogComponent } from '../dialogs/readiness-level-dialog/readiness-level-dialog.component';

@Component({
  selector: 'app-readiness-level-card',
  templateUrl: './readiness-level-card.component.html',
  styleUrls: ['./readiness-level-card.component.scss'],
})
export class ReadinessLevelCardComponent implements OnInit {
  @Input() readinessLevel!: ReadinessLevelModel;
  @Output() updateReadinessLevelEvent = new EventEmitter<ReadinessLevelModel>();

  constructor(
    private apiReadinessLevelService: ApiReadinessLevelService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  openReadinessLevelDialog(readinessLevel: ReadinessLevelModel) {
    const dialogRef = this.dialog.open(ReadinessLevelDialogComponent, {
      data: readinessLevel,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.updateReadinessLevelEvent.emit(result);
      }
    });
  }
}
