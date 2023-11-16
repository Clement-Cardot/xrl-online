import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BusinessLineModel } from 'src/app/core/data/models/business-line.model';
import { ApiBusinessLineService } from 'src/app/core/services/api-business-line.service';
import { AddUpdateBusinesslineDialogComponent } from '../dialogs/add-update-businessline-dialog/add-update-businessline-dialog.component';
import { DeleteObjectDialogComponent } from '../dialogs/delete-object-dialog/delete-object-dialog.component';

@Component({
  selector: 'app-business-line-item',
  templateUrl: './business-line-item.component.html',
  styleUrls: ['./business-line-item.component.scss']
})
export class BusinessLineItemComponent {

  @Input() businessLine!: BusinessLineModel;
  @Output() updateBusinessLineEvent = new EventEmitter<BusinessLineModel>();
  @Output() deleteBusinessLineEvent = new EventEmitter<BusinessLineModel>();

  constructor(
    private apiBusinessLineService: ApiBusinessLineService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  openAddUpdateBusinessLineDialog() {
    const dialogRef = this.dialog.open(AddUpdateBusinesslineDialogComponent, {
      disableClose: false,
      data: this.businessLine
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateBusinessLineEvent.emit(result);
      }
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteObjectDialogComponent, {
      data: {
        title: 'BUSINESSLINE.DELETE',
        content: this.businessLine.name
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiBusinessLineService.deleteBusinessLine(this.businessLine.id).subscribe({
          next: (v) => {
            this.deleteBusinessLineEvent.emit(v);
            this.snackBar.open(this.translateService.instant('BUSINESSLINE.DELETE_SUCCESS'), 'OK', {
              duration: 3000,
            });
          },
          error: (e) => console.error(e)
        });
      }
    });
  }

}
