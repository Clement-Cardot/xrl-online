import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import {
  Level,
  ReadinessLevelModel,
} from 'src/app/core/data/models/readiness-level.model';
import { ApiReadinessLevelService } from 'src/app/core/services/api-readiness-level.service';
import { DeleteObjectDialogComponent } from '../delete-object-dialog/delete-object-dialog.component';

@Component({
  selector: 'app-readiness-level-dialog',
  templateUrl: './readiness-level-dialog.component.html',
  styleUrls: ['./readiness-level-dialog.component.scss'],
})
export class ReadinessLevelDialogComponent implements OnInit {
  levels: Level[] = [];
  readinessLevel!: ReadinessLevelModel;
  createReadinessLevelForm!: FormGroup;
  formControlReadinessLevelName!: FormControl;
  formControlReadinessLevelDescription!: FormControl;
  createLevelForm!: FormGroup;
  formControlLevelsShortDesc!: FormControl[];
  formControlLevelsLongDesc!: FormControl[];
  displayedColumns: string[] = ['level', 'shortDescription', 'longDescription'];
  @ViewChild('matTableLevels') table!: MatTable<ReadinessLevelModel>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ReadinessLevelDialogComponent>,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private apiReadinessLevelService: ApiReadinessLevelService
  ) {
    for (let i = 1; i <= 9; i++) {
      const level = new Level(i.toString(), '', []);
      this.levels.push(level);
    }
    this.readinessLevel = new ReadinessLevelModel(
      '',
      '',
      '',
      this.levels,
      false
    );
  }

  ngOnInit() {
    this.dialogRef.updateSize('100%');

    if (this.data != null) this.readinessLevel = this.data;

    if (this.readinessLevel.isUsed) this.hideDeleteButton();

    this.formControlReadinessLevelName = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]);

    this.formControlReadinessLevelDescription = new FormControl('', [
      Validators.required,
      Validators.maxLength(1000),
    ]);

    this.formControlLevelsShortDesc = [];
    this.formControlLevelsLongDesc = [];

    for (let i = 1; i <= 9; i++) {
      const formControlShort = new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ]);

      const formControlLong = new FormControl(
        this.readinessLevel.levels[i - 1].longDescription.join('\n\n'),
        [Validators.required, Validators.maxLength(1000)]
      );
      this.formControlLevelsShortDesc.push(formControlShort);
      this.formControlLevelsLongDesc.push(formControlLong);
    }

    this.createReadinessLevelForm = this.formBuilder.group({
      name: this.formControlReadinessLevelName,
      description: this.formControlReadinessLevelDescription,
    });

    for (let i = 1; i <= 9; i++) {
      this.createReadinessLevelForm.addControl(
        'shortDescription' + i,
        this.formControlLevelsShortDesc[i - 1]
      );
      this.createReadinessLevelForm.addControl(
        'longDescription' + i,
        this.formControlLevelsLongDesc[i - 1]
      );
    }
  }

  getDialogTitle(): string {
    if (this.readinessLevel.id == '') {
      return this.translateService.instant('READINESS_LEVEL.CREATE');
    } else {
      return this.readinessLevel.name;
    }
  }

  getDialogButton(): string {
    if (this.readinessLevel.id == '') {
      return this.translateService.instant('ACTION.CREATE');
    } else {
      return this.translateService.instant('ACTION.SAVE');
    }
  }

  getNameErrorMessage(): string {
    if (this.formControlReadinessLevelName.hasError('required')) {
      return this.translateService.instant('READINESS_LEVEL.NAME_REQUIRED');
    } else if (this.formControlReadinessLevelName.hasError('minlength')) {
      return this.translateService.instant('READINESS_LEVEL.NAME_MIN_LENGTH');
    } else if (this.formControlReadinessLevelName.hasError('maxlength')) {
      return this.translateService.instant('READINESS_LEVEL.NAME_MAX_LENGTH');
    } else if (
      this.formControlReadinessLevelName.hasError('nameAlreadyExists')
    ) {
      return this.translateService.instant(
        'READINESS_LEVEL.NAME_ALREADY_EXISTS'
      );
    } else {
      return '';
    }
  }

  getDescriptionErrorMessage(): string {
    if (this.formControlReadinessLevelDescription.hasError('required')) {
      return this.translateService.instant(
        'READINESS_LEVEL.DESCRIPTION_REQUIRED'
      );
    } else if (
      this.formControlReadinessLevelDescription.hasError('maxlength')
    ) {
      return this.translateService.instant(
        'READINESS_LEVEL.DESCRIPTION_MAX_LENGTH'
      );
    } else {
      return '';
    }
  }

  getShortDescriptionErrorMessage(index: number): string {
    if (this.formControlLevelsShortDesc[index].hasError('required')) {
      return this.translateService.instant(
        'READINESS_LEVEL.DESCRIPTION_REQUIRED'
      );
    } else if (this.formControlLevelsShortDesc[index].hasError('maxlength')) {
      return this.translateService.instant(
        'READINESS_LEVEL.DESCRIPTION_MAX_LENGTH'
      );
    } else {
      return '';
    }
  }

  getLongDescriptionErrorMessage(index: number): string {
    if (this.formControlLevelsLongDesc[index].hasError('required')) {
      return this.translateService.instant(
        'READINESS_LEVEL.LONG_DESCRIPTION_REQUIRED'
      );
    } else if (this.formControlLevelsLongDesc[index].hasError('maxlength')) {
      return this.translateService.instant(
        'READINESS_LEVEL.DESCRIPTION_MAX_LENGTH'
      );
    } else {
      return '';
    }
  }

  saveReadinessLevel() {
    const levels: Level[] = [];
    for (let i = 0; i < 9; i++) {
      const level = new Level(
        (i + 1).toString(),
        this.formControlLevelsShortDesc[i].value,
        this.formControlLevelsLongDesc[i].value
          .split('\n')
          .filter((s: string) => s != '')
      );
      levels.push(level);
    }

    const readinessLevel: ReadinessLevelModel = new ReadinessLevelModel(
      this.readinessLevel.id,
      this.formControlReadinessLevelName.value,
      this.formControlReadinessLevelDescription.value,
      levels,
      this.readinessLevel.isUsed
    );
    if (this.readinessLevel.id == '') {
      this.apiReadinessLevelService
        .createReadinessLevel(readinessLevel)
        .subscribe({
          next: (readinessLevelResult) => {
            this.dialogRef.close({
              action: 'add',
              result: readinessLevelResult,
            });
            this.snackBar.open(
              this.translateService.instant('READINESS_LEVEL.CREATE_SUCCESS'),
              this.translateService.instant('CLOSE'),
              {
                duration: 3000,
              }
            );
          },
          error: (e) => {
            this.handleError(e);
          },
        });
    } else {
      this.apiReadinessLevelService
        .updateReadinessLevel(readinessLevel)
        .subscribe({
          next: (readinessLevelResult) => {
            this.dialogRef.close({
              action: 'update',
              result: readinessLevelResult,
            });
            this.snackBar.open(
              this.translateService.instant('READINESS_LEVEL.UPDATE_SUCCESS'),
              this.translateService.instant('CLOSE'),
              {
                duration: 3000,
              }
            );
          },
          error: (e) => {
            this.handleError(e);
          },
        });
    }
  }

  handleError(e: any) {
    console.log(e);
    switch (e.status) {
      case 409:
        this.formControlReadinessLevelName.setErrors({
          nameAlreadyExists: true,
        });
        console.log('Readiness Level name already exists');
        break;
      default:
        console.log('This error is not handled: ' + e);
        break;
    }
  }

  hideDeleteButton() {
    const deleteButton = document.querySelector(
      '#delete-rl-icon'
    ) as HTMLElement;
    if (deleteButton) {
      deleteButton.style.color = 'grey';
      deleteButton.style.pointerEvents = 'none';
    }
  }

  deleteReadinessLevel() {
    const dialogRef = this.dialog.open(DeleteObjectDialogComponent, {
      data: {
        title: 'READINESS_LEVEL.DELETE',
        content: this.readinessLevel.name,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiReadinessLevelService
          .deleteReadinessLevel(this.readinessLevel.id)
          .subscribe({
            next: (readinessLevelResult) => {
              this.dialogRef.close({
                action: 'delete',
                result: readinessLevelResult,
              });
              this.snackBar.open(
                this.translateService.instant('READINESS_LEVEL.DELETE_SUCCESS'),
                this.translateService.instant('CLOSE'),
                {
                  duration: 3000,
                }
              );
            },
            error: (e) => {
              console.log(e);
            },
          });
      }
    });
  }
}
