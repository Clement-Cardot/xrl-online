import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateTeamDialogComponent } from 'src/app/components/dialogs/add-update-team-dialog/add-update-team-dialog.component';
import { TeamModel } from 'src/app/core/data/models/team.model';
import { ApiTeamService } from 'src/app/core/services/api-team.service';

@Component({
  selector: 'app-admin-team-page',
  templateUrl: './admin-team-page.component.html',
  styleUrls: ['./admin-team-page.component.scss'],
})
export class AdminTeamPageComponent implements OnInit {

  teams: TeamModel[] = [];
  teamsToDisplay: TeamModel[] = [];

  displayOptions: any = {filterValue: '', searchType: 'name'};

  searchTypes: { typeValue: string; typeTranslation: string }[] = [
    { typeValue: 'name', typeTranslation: 'OBJECT.NAME' },
    { typeValue: 'user', typeTranslation: 'OBJECT.USER' }
  ];

  constructor(
    private apiTeamService: ApiTeamService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.apiTeamService.getAllTeams().subscribe({
      next: (v) => {
        this.teams = v;
        this.teamsToDisplay = v;
      },
      error: (err) => console.error(err),
    });
  }

  addTeam(team: TeamModel) {
    this.teams.push(team);
  }

  updateTeam(team: TeamModel) {
    const index = this.teams.findIndex((t) => t.id == team.id);
    this.teams[index] = team;
  }

  deleteTeam(team: TeamModel) {
    this.teams = this.teams.filter((t) => t.id != team.id);
    this.updateTeamsToDisplay(this.displayOptions);
  }

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
      if (result) {
        this.addTeam(result);
      }
    });
  }

  updateTeamsToDisplay(options: any) {
    this.displayOptions = options;
    if (options.filterValue == null || options.filterValue == '') {
      this.teamsToDisplay = this.teams;
      return;
    }
    switch (options.searchType) {
      case 'name':
        this.teamsToDisplay = this.teams.filter((t) => this._fcs(t.name).includes(this._fcs(options.filterValue ?? '')));
        break;
      case 'user':
        this.teamsToDisplay = this.teams.filter((t) => 
          t.members.some(member => this._fcs(member.firstName + member.lastName).includes(this._fcs(options.filterValue ?? ''))));
        break;
      default:
        this.teamsToDisplay = this.teams;
        break;
    }
  }

  // Remove accents and lowercase string
  private _fcs(value: string): string {
    value = value.toLowerCase();
    value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return value;
  }

  updateTeams() {
    this.apiTeamService.getAllTeams().subscribe({
      next: (v) => {
        this.teams = v;
        this.updateTeamsToDisplay(this.displayOptions);
      },
      error: (err) => console.error(err),
    });
  }

}