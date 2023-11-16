import { Component } from '@angular/core';
import { BusinessLineModel } from 'src/app/core/data/models/business-line.model';
import { ApiBusinessLineService } from 'src/app/core/services/api-business-line.service';

@Component({
  selector: 'app-admin-business-line-page',
  templateUrl: './admin-business-line-page.component.html',
  styleUrls: ['./admin-business-line-page.component.scss']
})
export class AdminBusinessLinePageComponent {

  businessLines: BusinessLineModel[] = [];

  constructor(private apiBusinessLineService: ApiBusinessLineService) { }

  ngOnInit(): void {
    this.apiBusinessLineService.getAllBusinessLines().subscribe({
      next: (v) => (this.businessLines = v),
      error: (err) => console.log(err),
    });
  }

  addBusinessLine(businessLine: BusinessLineModel) {
    this.businessLines.push(businessLine);
  }

  deleteBusinessLine(businessLine: BusinessLineModel) {
    this.businessLines = this.businessLines.filter((bl) => bl.id != businessLine.id);
  }

}
