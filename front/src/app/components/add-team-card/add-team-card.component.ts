import { Component } from '@angular/core';
import { TeamModel } from '../../core/data/models/team.model';
import { MatDialog } from '@angular/material/dialog';
import { ApiTeamService } from '../../core/services/api-team.service';
import { AddTeamDialogComponent } from '../dialogs/add-team-dialog/add-team-dialog.component';

@Component({
  selector: 'app-add-team-card',
  templateUrl: './add-team-card.component.html',
  styleUrls: ['./add-team-card.component.scss'],
})
export class AddTeamCardComponent {
  constructor(
    private apiTeamService: ApiTeamService,
    public dialog: MatDialog
  ) {}

  openAddTeamDialog() {
    const dialogRef = this.dialog.open(AddTeamDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiTeamService.createTeam(result).subscribe({
          next: (v) => console.log(v), //TODO: add team to teams array
          error: (err) => console.log(err),
        });
      }
      console.log('The dialog was closed', 'result :' + result);
    });
  }
}
