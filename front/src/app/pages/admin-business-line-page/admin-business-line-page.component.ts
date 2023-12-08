import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateBusinesslineDialogComponent } from 'src/app/components/dialogs/add-update-businessline-dialog/add-update-businessline-dialog.component';
import { BusinessLineModel } from 'src/app/core/data/models/business-line.model';
import { ApiBusinessLineService } from 'src/app/core/services/api-business-line.service';

@Component({
  selector: 'app-admin-business-line-page',
  templateUrl: './admin-business-line-page.component.html',
  styleUrls: ['./admin-business-line-page.component.scss']
})
export class AdminBusinessLinePageComponent {

  businessLines: BusinessLineModel[] = [];
  businessLinesToDisplay: BusinessLineModel[] = [];

  searchTypes: { typeValue: string; typeTranslation: string }[] = [
    { typeValue: 'name', typeTranslation: 'BUSINESSLINE.SEARCH_NAME' }
  ];

  constructor(
    private apiBusinessLineService: ApiBusinessLineService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.apiBusinessLineService.getAllBusinessLines().subscribe({
      next: (v) => {
        this.businessLines = v;
        this.businessLinesToDisplay = v;
      },
      error: (err) => console.log(err),
    });
  }

  addBusinessLine(businessLine: BusinessLineModel) {
    this.businessLines.push(businessLine);
  }

  deleteBusinessLine(businessLine: BusinessLineModel) {
    this.businessLines = this.businessLines.filter((bl) => bl.id != businessLine.id);
  }

  updateBusinessLinesToDisplay(options: any) {
    if (options.filterValue == null || options.filterValue == '') {
      this.businessLinesToDisplay = this.businessLines;
      return;
    }
    switch (options.searchType) {
      case 'name':
        this.businessLinesToDisplay = this.businessLines.filter((bl) => this._fcs(bl.name).includes(this._fcs(options.filterValue ?? '')));
        break;
      default:
        this.businessLinesToDisplay = this.businessLines;
        break;
    }
  }

  // Remove accents and lowercase string
  private _fcs(value: string): string {
    value = value.toLowerCase();
    value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return value;
  }

  openAddUpdateBusinessLineDialog() {
    const dialogRef = this.dialog.open(AddUpdateBusinesslineDialogComponent, {
      disableClose: false,
      panelClass: 'add-update-businessline-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.addBusinessLine(result);
      }
    });
  }

}
