import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';
import { ApiBusinessLineService } from './core/services/api-business-line.service';
import { ApiProjectService } from './core/services/api-project.service';
import { ApiReadinessLevelService } from './core/services/api-readiness-level.service';
import { ApiTeamService } from './core/services/api-team.service';
import { ApiUserService } from './core/services/api-user.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    ComponentsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    ApiBusinessLineService,
    ApiProjectService,
    ApiReadinessLevelService,
    ApiTeamService,
    ApiUserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
