import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamModel } from 'src/app/core/data/models/team.model';
import { ApiTeamService } from 'src/app/core/services/api-team.service';
import { DeleteTeamDialogComponent } from '../delete-team-dialog/delete-team-dialog.component';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss'],
})
export class TeamCardComponent {
  displayedColumns: string[] = ['firstName', 'lastName'];
  @Input() team!: TeamModel;

  constructor(
    private apiTeamService: ApiTeamService,
    public dialog: MatDialog
  ) {}

  openDeleteTeamDialog() {
    const dialogRef = this.dialog.open(DeleteTeamDialogComponent, {
      disableClose: true,
      data: this.team,
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.apiTeamService.deleteTeam(this.team.id);
    //   }
    //   console.log('The dialog was closed', 'result :' + result);
    // });
  }
}
