import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ReadinessLevelPageComponent } from './pages/readiness-level-page/readiness-level-page.component';
import { AdminReadinessLevelPageComponent } from './pages/admin-readiness-level-page/admin-readiness-level-page.component';
import { AdminTeamPageComponent } from './pages/admin-team-page/admin-team-page.component';
import { AdminBusinessLinePageComponent } from './pages/admin-business-line-page/admin-business-line-page.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { NotFoundPage } from './pages/error-pages/not-found-page/not-found-page';
import { ExpiredSessionPage } from './pages/error-pages/expired-session-page/expired-session-page';

const websiteName = 'xRL Online';

const routes: Routes = [

  // Home Page
  {path: '', title: websiteName, component: HomePageComponent},

  // Projects Page
  {path: 'projects', title: websiteName, component: ProjectsPageComponent},
  {path: 'project/:id', title: websiteName, component: ProjectPageComponent},

  // Readiness Levels Page
  {path: 'readiness-levels', title: websiteName, component: ReadinessLevelPageComponent},

  // Admin Pages :
  {path: 'admin/readiness-levels', title: websiteName, component: AdminReadinessLevelPageComponent},
  {path: 'admin/teams', title: websiteName, component: AdminTeamPageComponent},
  {path: 'admin/business-lines', title: websiteName, component: AdminBusinessLinePageComponent},

  // Error Pages :
  {path: 'session-expired', title: websiteName, component: ExpiredSessionPage},
  {path: '404', title: websiteName, component: NotFoundPage},
  {path: '**', pathMatch: 'full', title: websiteName, component: NotFoundPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
