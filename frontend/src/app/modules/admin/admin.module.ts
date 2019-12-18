import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminPanelUsersComponent} from './components/admin-panel-users/admin-panel-users.component';
import {AdminRoutingModule} from './admin-routing.module';



@NgModule({
  declarations: [AdminPanelUsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
