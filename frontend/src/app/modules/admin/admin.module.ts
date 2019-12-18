import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from './admin-routing.module';
import {UsersComponent} from './components/users/users.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';



@NgModule({
  declarations: [UsersComponent, MainPanelComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
