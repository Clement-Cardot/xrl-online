import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamModel } from 'src/app/core/data/models/team.model';
import { ApiTeamService } from 'src/app/core/services/api-team.service';
import { AddUpdateTeamDialogComponent } from '../../dialogs/add-update-team-dialog/add-update-team-dialog.component';
import { DeleteObjectDialogComponent } from '../../dialogs/delete-object-dialog/delete-object-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ApiProjectService } from 'src/app/core/services/api-project.service';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss'],
})
export class TeamCardComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName'];
  @Input() team!: TeamModel;
  @Output() updateTeamEvent = new EventEmitter<TeamModel>();
  @Output() deleteTeamEvent = new EventEmitter<TeamModel>();

  constructor(
    private apiTeamService: ApiTeamService,
    private apiProjectService: ApiProjectService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    this.apiProjectService.getProjectsByTeamId(this.team.id).subscribe({
      next: (v) => {
        // if there are projects for this team, we hide the delete button
        if (v.length > 0) {
          this.hideDeleteButton();
        }
      },
      error: (e) => console.error(e),
    });
  }

  /**
   * Opens a dialog to delete the team.
   * @returns void
   */
  openDeleteTeamDialog() {
    const dialogRef = this.dialog.open(DeleteObjectDialogComponent, {
      data: {
        title: 'TEAM.DELETE_CONFIRM',
        content: this.team.name,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiTeamService.deleteTeam(this.team.id).subscribe({
          next: (v) => {
            this.deleteTeamEvent.emit(v);
            this.snackBar.open(
              this.translateService.instant('TEAM.DELETE_SUCCESS'),
              this.translateService.instant('ACTION.CLOSE'),
              {
                duration: 3000,
              }
            );
          },
          error: (e) => console.error(e),
        });
      }
    });
  }

  /**
   * Opens a dialog to update a team.
   * @returns void
   */
  openAddUpdateTeamDialog() {
    const dialogRef = this.dialog.open(AddUpdateTeamDialogComponent, {
      disableClose: false,
      autoFocus: false,
      data: structuredClone(this.team),
      panelClass: 'add-update-team-dialog',
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTeamEvent.emit(result);
      }
    });
  }

  hideDeleteButton() {
    const deleteButton = document.querySelector(
      '#team-card-'+this.team.id+' > mat-card-header > .icons-container > #delete'
    ) as HTMLElement;
    if (deleteButton) {
      deleteButton.style.color = 'grey';
      deleteButton.style.pointerEvents = 'none';
    }
  }
}
