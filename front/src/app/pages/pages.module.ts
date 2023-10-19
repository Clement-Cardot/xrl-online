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

@NgModule({
  declarations: [
    ProjectsPageComponent,
    HomePageComponent,
    ReadinessLevelPageComponent,
    AdminReadinessLevelPageComponent,
    AdminTeamPageComponent,
    AdminBusinessLinePageComponent,
  ],
  imports: [CommonModule, ComponentsModule, MatGridListModule],
  exports: [
    ProjectsPageComponent,
    HomePageComponent,
    ReadinessLevelPageComponent,
    AdminReadinessLevelPageComponent,
    AdminTeamPageComponent,
    AdminBusinessLinePageComponent,
  ],
})
export class PagesModule {}
