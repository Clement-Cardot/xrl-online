import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { TeamsPageComponent } from './pages/teams-page/teams-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';

const websiteName = ' - xRL Online';

const routes: Routes = [

  // Login Page
  {path: '', title: 'Login' + websiteName, component: LoginPageComponent},

  // Main Page (Dashboard)
  {path: 'dashboard', title: 'Dashboard' + websiteName, component: DashboardPageComponent},

  // Projects Page
  {path: 'projects', title: 'Projects' + websiteName, component: ProjectsPageComponent},

  // Teams Page
  {path: 'teams', title: 'Teams' + websiteName, component: TeamsPageComponent},

  // Users Page
  {path: 'users', title: 'Users' + websiteName, component: UsersPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
