import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ReadinessLevelPageComponent } from './pages/readiness-level-page/readiness-level-page.component';
import { AdminReadinessLevelPageComponent } from './pages/admin-readiness-level-page/admin-readiness-level-page.component';
import { AdminTeamPageComponent } from './pages/admin-team-page/admin-team-page.component';
import { AdminBusinessLinePageComponent } from './pages/admin-business-line-page/admin-business-line-page.component';

const websiteName = ' - xRL Online';

const routes: Routes = [

  // Home Page
  {path: '', title: 'Home' + websiteName, component: HomePageComponent},

  // Projects Page
  {path: 'Projects', title: 'Projects' + websiteName, component: ProjectsPageComponent},

  // Readiness Levels Page
  {path: 'ReadinessLevels', title: 'Readiness Levels' + websiteName, component: ReadinessLevelPageComponent},

  // Admin Pages :
  {path: 'Admin/ReadinessLevels', title: 'Admin RL' + websiteName, component: AdminReadinessLevelPageComponent},
  {path: 'Admin/Teams', title: 'Admin Teams' + websiteName, component: AdminTeamPageComponent},
  {path: 'Admin/BusinessLines', title: 'Admin BL' + websiteName, component: AdminBusinessLinePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
