import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { TeamCardComponent } from './team-card/team-card.component';
import { MaterialModule } from '../material.module';
import { ServicesModule } from '../core/services/services.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FooterComponent,
    LoginComponent,
    NavbarComponent,
    ProjectCardComponent,
    TeamCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ServicesModule,
    ReactiveFormsModule
  ],
  exports: [
    FooterComponent,
    LoginComponent,
    NavbarComponent,
    ProjectCardComponent,
    TeamCardComponent
  ]
})
export class ComponentsModule { }
