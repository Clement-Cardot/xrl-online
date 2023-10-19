import { Component, OnInit } from '@angular/core';
import { TeamModel } from 'src/app/core/data/models/team.model';
import { ApiTeamService } from 'src/app/core/services/api-team.service';

@Component({
  selector: 'app-admin-team-page',
  templateUrl: './admin-team-page.component.html',
  styleUrls: ['./admin-team-page.component.scss'],
})
export class AdminTeamPageComponent implements OnInit {
  teams: TeamModel[] = [];

  constructor(private apiTeamService: ApiTeamService) {}

  ngOnInit(): void {
    this.apiTeamService.getAllTeams().subscribe({
      next: (v) => (this.teams = v),
      error: (err) => console.log(err),
    });
  }
}
