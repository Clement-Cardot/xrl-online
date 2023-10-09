import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { TeamsPageComponent } from './teams-page/teams-page.component';
import { UsersPageComponent } from './users-page/users-page.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { ComponentsModule } from '../components/components.module';



@NgModule({
  declarations: [
    LoginPageComponent,
    TeamsPageComponent,
    UsersPageComponent,
    ProjectsPageComponent,
    DashboardPageComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule
  ],
  exports: [
    LoginPageComponent,
    TeamsPageComponent,
    UsersPageComponent,
    ProjectsPageComponent,
    DashboardPageComponent
  ]
})
export class PagesModule { }
