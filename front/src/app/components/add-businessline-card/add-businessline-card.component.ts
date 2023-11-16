import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessLineModel } from 'src/app/core/data/models/business-line.model';
import { AddUpdateBusinesslineDialogComponent } from '../dialogs/add-update-businessline-dialog/add-update-businessline-dialog.component';

@Component({
  selector: 'app-add-businessline-card',
  templateUrl: './add-businessline-card.component.html',
  styleUrls: ['./add-businessline-card.component.scss'],
})
export class AddBusinesslineCardComponent {
  @Output() addBusinessLineEvent = new EventEmitter<BusinessLineModel>();
  constructor(
    public dialog: MatDialog
  ) {}

  openAddUpdateBusinessLineDialog() {
    const dialogRef = this.dialog.open(AddUpdateBusinesslineDialogComponent, {
      disableClose: false,
      panelClass: 'add-update-businessline-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.addBusinessLineEvent.emit(result);
      }
    });
  }
}
