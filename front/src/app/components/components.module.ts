import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { TeamCardComponent } from './team-card/team-card.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageMenuComponent } from './language-menu/language-menu.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import { DeleteObjectDialogComponent } from './dialogs/delete-object-dialog/delete-object-dialog.component';
import { UserFormDialogComponent } from './dialogs/user-form-dialog/user-form-dialog.component';
import { AddUpdateTeamDialogComponent } from './dialogs/add-update-team-dialog/add-update-team-dialog.component';
import { AddTeamCardComponent } from './add-team-card/add-team-card.component';
import { DeleteTeamDialogComponent } from './dialogs/delete-team-dialog/delete-team-dialog.component';
import { ProjectItemListComponent } from './project-item-list/project-item-list.component';
import { ProjectFormDialogComponent } from './dialogs/project-form-dialog/project-form-dialog.component';
import { XrlGraphRadarComponent } from './xrl-graph-radar/xrl-graph-radar.component';
import { XrlGraphGaugeComponent } from './xrl-graph-gauge/xrl-graph-gauge.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BusinessLineItemComponent } from './business-line-item/business-line-item.component';
import { DeleteBusinesslineDialogComponent } from './dialogs/delete-businessline-dialog/delete-businessline-dialog.component';
import { AddUpdateBusinesslineDialogComponent } from './dialogs/add-update-businessline-dialog/add-update-businessline-dialog.component';
import { AddBusinesslineCardComponent } from './add-businessline-card/add-businessline-card.component';

@NgModule({
  declarations: [
    FooterComponent,
    LoginComponent,
    ProjectCardComponent,
    TeamCardComponent,
    LanguageMenuComponent,
    UsersManagementComponent,
    DeleteObjectDialogComponent,
    UserFormDialogComponent,
    AddUpdateTeamDialogComponent,
    AddTeamCardComponent,
    DeleteTeamDialogComponent,
    ProjectItemListComponent,
    ProjectFormDialogComponent,
    BusinessLineItemComponent,
    DeleteBusinesslineDialogComponent,
    AddUpdateBusinesslineDialogComponent,
    AddBusinesslineCardComponent,
    XrlGraphRadarComponent,
    XrlGraphGaugeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    NgApexchartsModule,
  ],
  exports: [
    FooterComponent,
    LoginComponent,
    ProjectCardComponent,
    TeamCardComponent,
    LanguageMenuComponent,
    UsersManagementComponent,
    AddUpdateTeamDialogComponent,
    AddTeamCardComponent,
    ProjectItemListComponent,
    XrlGraphRadarComponent,
    XrlGraphGaugeComponent,
    BusinessLineItemComponent,
    DeleteBusinesslineDialogComponent,
    AddUpdateBusinesslineDialogComponent,
    AddBusinesslineCardComponent,
  ],
})
export class ComponentsModule {}
