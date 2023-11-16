import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamModel } from 'src/app/core/data/models/team.model';
import { ApiTeamService } from 'src/app/core/services/api-team.service';
import { DeleteTeamDialogComponent } from '../dialogs/delete-team-dialog/delete-team-dialog.component';
import { AddUpdateTeamDialogComponent } from '../dialogs/add-update-team-dialog/add-update-team-dialog.component';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss'],
})
export class TeamCardComponent {
  displayedColumns: string[] = ['firstName', 'lastName'];
  @Input() team!: TeamModel;
  @Output() updateTeamEvent = new EventEmitter<TeamModel>();
  @Output() deleteTeamEvent = new EventEmitter<TeamModel>();

  constructor(
    private apiTeamService: ApiTeamService,
    public dialog: MatDialog
  ) {}

  /**
   * Opens a dialog to delete the team.
   * @returns void
   */
  openDeleteTeamDialog() {
    const dialogRef = this.dialog.open(DeleteTeamDialogComponent, {
      disableClose: false,
      data: this.team,
      panelClass: 'delete-team-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.deleteTeamEvent.emit(result);
    });
  }

  /**
   * Opens a dialog to update a team.
   * @returns void
   */
  openAddUpdateTeamDialog() {
    const dialogRef = this.dialog.open(AddUpdateTeamDialogComponent, {
      disableClose: false,
      data: this.team,
      panelClass: 'add-update-team-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTeamEvent.emit(result);
      }
      console.log('The dialog was closed', 'result :' + result);
    });
  }
}
