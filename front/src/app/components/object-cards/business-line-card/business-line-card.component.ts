import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BusinessLineModel } from 'src/app/core/data/models/business-line.model';
import { ApiBusinessLineService } from 'src/app/core/services/api-business-line.service';
import { AddUpdateBusinesslineDialogComponent } from '../../dialogs/add-update-businessline-dialog/add-update-businessline-dialog.component';
import { DeleteObjectDialogComponent } from '../../dialogs/delete-object-dialog/delete-object-dialog.component';
import { ApiProjectService } from 'src/app/core/services/api-project.service';
import { ProjectModel } from 'src/app/core/data/models/project.model';

@Component({
  selector: 'app-business-line-card',
  templateUrl: './business-line-card.component.html',
  styleUrls: ['./business-line-card.component.scss'],
})
export class BusinessLineCardComponent implements OnInit {
  @Input() businessLine!: BusinessLineModel;
  @Output() updateBusinessLineEvent = new EventEmitter<BusinessLineModel>();
  @Output() deleteBusinessLineEvent = new EventEmitter<BusinessLineModel>();

  projects: ProjectModel[] = [];
  displayedColumns: string[] = ['projectName', 'projectTeamName'];

  constructor(
    private apiBusinessLineService: ApiBusinessLineService,
    private apiProjectService: ApiProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    this.apiProjectService
      .getProjectsByBusinessLineId(this.businessLine.id)
      .subscribe({
        next: (v) => {
          // if there are projects for this business line, we hide the delete button
          if (v.length > 0) {
            this.projects = v;
            this.hideDeleteButton();
          }
        },
        error: (e) => console.error(e),
      });
  }

  hideDeleteButton() {
    const deleteButton = document.querySelector(
      '#business-line-card-'+this.businessLine.id+' > mat-card-header > .icons-container > #delete'
    ) as HTMLElement;
    if (deleteButton) {
      deleteButton.style.color = 'grey';
      deleteButton.style.pointerEvents = 'none';
    }
  }

  openAddUpdateBusinessLineDialog() {
    const dialogRef = this.dialog.open(AddUpdateBusinesslineDialogComponent, {
      disableClose: false,
      data: this.businessLine,
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
        content: this.businessLine.name,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiBusinessLineService
          .deleteBusinessLine(this.businessLine.id)
          .subscribe({
            next: (v) => {
              this.deleteBusinessLineEvent.emit(v);
              this.snackBar.open(
                this.translateService.instant('BUSINESSLINE.DELETE_SUCCESS'),
                'OK',
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

  getProjectCount() {
    return this.projects.length;
  }

  getProjectsName() {
    return this.projects.map((p) => p.name).join(', ');
  }

}
