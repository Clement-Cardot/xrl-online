import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TeamModel } from 'src/app/core/data/models/team.model';
import { ApiTeamService } from 'src/app/core/services/api-team.service';

@Component({
  selector: 'app-delete-team-dialog',
  templateUrl: './delete-team-dialog.component.html',
  styleUrls: ['./delete-team-dialog.component.scss'],
})
export class DeleteTeamDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteTeamDialogComponent>,
    private apiTeamService: ApiTeamService,
    @Inject(MAT_DIALOG_DATA) public team: TeamModel
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  deleteTeam() {
    this.apiTeamService.deleteTeam(this.team.id).subscribe();
    this.dialogRef.close(this.team);
  }
}
