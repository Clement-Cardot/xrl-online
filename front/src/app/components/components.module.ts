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
import { DeleteUserDialogComponent } from './dialogs/delete-user-dialog/delete-user-dialog.component';
import { UserFormDialogComponentComponent } from './dialogs/user-form-dialog-component/user-form-dialog-component.component';
import { AddTeamDialogComponent } from './dialogs/add-team-dialog/add-team-dialog.component';
import { AddTeamCardComponent } from './add-team-card/add-team-card.component';
import { DeleteTeamDialogComponent } from './dialogs/delete-team-dialog/delete-team-dialog.component';

@NgModule({
  declarations: [
    FooterComponent,
    LoginComponent,
    ProjectCardComponent,
    TeamCardComponent,
    LanguageMenuComponent,
    UsersManagementComponent,
    DeleteUserDialogComponent,
    UserFormDialogComponentComponent,
    AddTeamDialogComponent,
    AddTeamCardComponent,
    DeleteTeamDialogComponent,
  ],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, TranslateModule],
  exports: [
    FooterComponent,
    LoginComponent,
    ProjectCardComponent,
    TeamCardComponent,
    LanguageMenuComponent,
    UsersManagementComponent,
    AddTeamDialogComponent,
    AddTeamCardComponent,
  ],
})
export class ComponentsModule {}
