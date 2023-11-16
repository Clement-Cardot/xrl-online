import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamModel } from '../../core/data/models/team.model';
import { AddUpdateTeamDialogComponent } from '../dialogs/add-update-team-dialog/add-update-team-dialog.component';

@Component({
  selector: 'app-add-team-card',
  templateUrl: './add-team-card.component.html',
  styleUrls: ['./add-team-card.component.scss'],
})
export class AddTeamCardComponent {
  @Output() addTeamEvent = new EventEmitter<TeamModel>();
  constructor(public dialog: MatDialog) {}

  /**
   * Open the add team dialog
   * @returns void
   */
  openAddUpdateTeamDialog() {
    const dialogRef = this.dialog.open(AddUpdateTeamDialogComponent, {
      disableClose: false,
      panelClass: 'add-update-team-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.addTeamEvent.emit(result);
      }
    });
  }
}
