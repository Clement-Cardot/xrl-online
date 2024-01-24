import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { ProjectCardComponent } from './object-cards/project-card/project-card.component';
import { TeamCardComponent } from './object-cards/team-card/team-card.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageMenuComponent } from './language-menu/language-menu.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import { DeleteObjectDialogComponent } from './dialogs/delete-object-dialog/delete-object-dialog.component';
import { UserFormDialogComponent } from './dialogs/user-form-dialog/user-form-dialog.component';
import { AddUpdateTeamDialogComponent } from './dialogs/add-update-team-dialog/add-update-team-dialog.component';
import { ProjectFormDialogComponent } from './dialogs/project-form-dialog/project-form-dialog.component';
import { XrlGraphGaugeComponent } from './graphs/xrl-graph-gauge/xrl-graph-gauge.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BusinessLineCardComponent } from './object-cards/business-line-card/business-line-card.component';
import { AddUpdateBusinesslineDialogComponent } from './dialogs/add-update-businessline-dialog/add-update-businessline-dialog.component';
import { XrlGraphComponent } from './graphs/xrl-graph/xrl-graph.component';
import { NgChartsModule } from 'ng2-charts';
import { CreateModifyAssessmentDialogComponent } from './dialogs/create-modify-assessment-dialog/create-modify-assessment-dialog.component';
import { ReadinessLevelDialogComponent } from './dialogs/readiness-level-dialog/readiness-level-dialog.component';
import { FilterAddToolboxComponent } from './filter-add-toolbox/filter-add-toolbox.component';
import { LinearGraphComponent } from './graphs/linear-graph/linear-graph.component';
import { CompareDialogComponent } from './dialogs/compare-dialog/compare-dialog.component';
import { LoaderComponent } from './loader/loader.component';
import { InfoDescriptionRlRankComponent } from './dialogs/info-description-rl-rank/info-description-rl-rank.component';
import { InfoMemberTeamComponent } from './dialogs/info-member-team/info-member-team.component';
import { GraphButtonComponent } from './graphs/graph-button/graph-button.component';

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
    XrlGraphGaugeComponent,
    XrlGraphComponent,
    CreateModifyAssessmentDialogComponent,
    ReadinessLevelDialogComponent,
    FilterAddToolboxComponent,
    LinearGraphComponent,
    CompareDialogComponent,
    LoaderComponent,
    InfoDescriptionRlRankComponent,
    InfoMemberTeamComponent,
    GraphButtonComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    NgApexchartsModule,
    NgChartsModule,
  ],
  exports: [
    FooterComponent,
    LoginComponent,
    ProjectCardComponent,
    TeamCardComponent,
    LanguageMenuComponent,
    UsersManagementComponent,
    AddUpdateTeamDialogComponent,
    XrlGraphGaugeComponent,
    BusinessLineCardComponent,
    AddUpdateBusinesslineDialogComponent,
    XrlGraphComponent,
    ReadinessLevelDialogComponent,
    FilterAddToolboxComponent,
    LinearGraphComponent,
    LoaderComponent
  ],
})
export class ComponentsModule {}
