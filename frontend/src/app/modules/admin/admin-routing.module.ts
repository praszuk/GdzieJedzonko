import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminPanelUsersComponent} from './components/admin-panel-users/admin-panel-users.component';

const routes: Routes = [
  {
    path: 'users',
    component: AdminPanelUsersComponent,
  }
]



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
