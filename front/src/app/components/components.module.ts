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
import { ProjectFormDialogComponent } from './dialogs/project-form-dialog/project-form-dialog.component';
import { XrlGraphRadarComponent } from './xrl-graph-radar/xrl-graph-radar.component';
import { XrlGraphGaugeComponent } from './xrl-graph-gauge/xrl-graph-gauge.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BusinessLineCardComponent } from './business-line-card/business-line-card.component';
import { AddUpdateBusinesslineDialogComponent } from './dialogs/add-update-businessline-dialog/add-update-businessline-dialog.component';
import { CreateAssessmentDialogComponent } from './dialogs/create-assessment-dialog/create-assessment-dialog.component';
import { ReadinessLevelCardComponent } from './readiness-level-card/readiness-level-card.component';
import { ReadinessLevelDialogComponent } from './dialogs/readiness-level-dialog/readiness-level-dialog.component';
import { FilterAddToolboxComponent } from './filter-add-toolbox/filter-add-toolbox.component';

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
    ProjectFormDialogComponent,
    BusinessLineCardComponent,
    AddUpdateBusinesslineDialogComponent,
    XrlGraphRadarComponent,
    XrlGraphGaugeComponent,
    CreateAssessmentDialogComponent,
    ReadinessLevelCardComponent,
    ReadinessLevelDialogComponent,
    FilterAddToolboxComponent,
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
    XrlGraphRadarComponent,
    XrlGraphGaugeComponent,
    BusinessLineCardComponent,
    AddUpdateBusinesslineDialogComponent,
    ReadinessLevelCardComponent,
    ReadinessLevelDialogComponent,
    FilterAddToolboxComponent,
  ],
})
export class ComponentsModule {}
