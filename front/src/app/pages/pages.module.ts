import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { ComponentsModule } from '../components/components.module';
import { HomePageComponent } from './home-page/home-page.component';
import { ReadinessLevelPageComponent } from './readiness-level-page/readiness-level-page.component';
import { AdminReadinessLevelPageComponent } from './admin-readiness-level-page/admin-readiness-level-page.component';
import { AdminTeamPageComponent } from './admin-team-page/admin-team-page.component';
import { AdminBusinessLinePageComponent } from './admin-business-line-page/admin-business-line-page.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectPageComponent } from './project-page/project-page.component';
import { NotFoundPage } from './error-pages/not-found-page/not-found-page';
import { ExpiredSessionPage } from './error-pages/expired-session-page/expired-session-page';

@NgModule({
  declarations: [
    ProjectsPageComponent,
    HomePageComponent,
    ReadinessLevelPageComponent,
    AdminReadinessLevelPageComponent,
    AdminTeamPageComponent,
    AdminBusinessLinePageComponent,
    ProjectPageComponent,
    NotFoundPage,
    ExpiredSessionPage
  ],
  imports: [
    CommonModule, 
    ComponentsModule,
    MatGridListModule,
    MaterialModule, 
    ReactiveFormsModule, 
    TranslateModule
  ],
  exports: [
  ],
})
export class PagesModule {}
