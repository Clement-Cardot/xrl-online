import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BusinessLineModel } from 'src/app/core/data/models/business-line.model';
import { ApiBusinessLineService } from 'src/app/core/services/api-business-line.service';

@Component({
  selector: 'app-add-update-businessline-dialog',
  templateUrl: './add-update-businessline-dialog.component.html',
  styleUrls: ['./add-update-businessline-dialog.component.scss']
})
export class AddUpdateBusinesslineDialogComponent implements OnInit {

  businessLine = new BusinessLineModel("", "");
  formControlBusinessLineName!: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiBusinessLineService: ApiBusinessLineService,
    private dialogRef: MatDialogRef<AddUpdateBusinesslineDialogComponent>,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {


  }
  ngOnInit(): void {
    this.formControlBusinessLineName = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]);

    if (this.data != null) {
      this.businessLine = this.data;
      this.formControlBusinessLineName.setValue(this.businessLine.name);
    }

  }


  saveBusinessLine() {
    const businessLine: BusinessLineModel = new BusinessLineModel(this.businessLine.id, this.formControlBusinessLineName.value);
    if (this.businessLine.id != '') {
      this.apiBusinessLineService.updateBusinessLine(businessLine).subscribe({
        next: (businessLine) => {
          this.dialogRef.close(businessLine);
          this.businessLine.name = businessLine.name;
          this.snackBar.open(this.translateService.instant('BUSINESSLINE.BUSINESSLINE_UPDATED'), this.translateService.instant('CLOSE'), {
            duration: 3000
          });
        },
        error: (e) => {
          this.handleError(e);
        }
      });
    } else {
      this.apiBusinessLineService.createBusinessLine(businessLine).subscribe({
        next: (businessLine) => {
          this.dialogRef.close(businessLine);
          this.businessLine.name = businessLine.name;
          this.snackBar.open(this.translateService.instant('BUSINESSLINE.BUSINESSLINE_CREATED'), this.translateService.instant('CLOSE'), {
            duration: 3000
          });
        },
        error: (e) => {
          this.handleError(e);
        }
      });
    }
  }

  getNameErrorMessage(): string {
    if (this.formControlBusinessLineName.hasError('required')) {
      return this.translateService.instant('BUSINESSLINE.NAME_REQUIRED');
    }
    if (this.formControlBusinessLineName.hasError('minlength')) {
      return this.translateService.instant('BUSINESSLINE.NAME_MIN_LENGTH');
    }
    if (this.formControlBusinessLineName.hasError('maxlength')) {
      return this.translateService.instant('BUSINESSLINE.NAME_MAX_LENGTH');
    }
    if (this.formControlBusinessLineName.hasError('nameAlreadyExist')) {
      return this.translateService.instant('BUSINESSLINE.NAME_ALREADY_EXISTS');
    }
    return '';
  }

  handleError(error: any): void {
    switch (error.status) {
      case 409: // Conflict
        console.log('Error 409: ', error);
        this.formControlBusinessLineName.setErrors({ nameAlreadyExist: true });
        break;
      default:
        console.log('This error is not handled: ', error);
        break;
    }
  }

  getDialogTitle(): string {
    if (this.businessLine.id != '') {
      return this.translateService.instant('BUSINESSLINE.UPDATE_BUSINESSLINE');
    } else {
      return this.translateService.instant('BUSINESSLINE.CREATE_BUSINESSLINE');
    }
  }

}
