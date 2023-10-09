import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { NavComponent } from './nav.component';
import { AppRoutingModule } from '../app-routing.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    ComponentsModule
  ],
  exports: [
    NavComponent,
  ]
})
export class SidenavModule { }
