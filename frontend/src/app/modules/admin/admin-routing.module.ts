import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPanelComponent} from './components/main-panel/main-panel.component';
import {EditProfileComponent} from '../shared/components/edit-profile/edit-profile.component';
import {UsersComponent} from './components/users/users.component';
import {BasicInformationComponent} from '../shared/components/edit-profile/basic-information/basic-information.component';
import {ChangePasswordComponent} from '../shared/components/edit-profile/change-password/change-password.component';
import {ChangeRoleComponent} from '../shared/components/edit-profile/change-role/change-role.component';
import {DeleteAccountComponent} from '../shared/components/edit-profile/delete-account/delete-account.component';

const routes: Routes = [
  {
    path: '',
    component: MainPanelComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
      }, {
        path: '',
        redirectTo: '/admin/users',
        pathMatch: 'full'
      }
    ]
  }, {
    path: 'editprofile/:id',
    component: EditProfileComponent,
    children: [{
      path: '',
      redirectTo: 'basic-information',
      pathMatch: 'full'
    }, {
      path: 'basic-information',
      component: BasicInformationComponent
    }, {
      path: 'password',
      component: ChangePasswordComponent
    }, {
      path: 'role',
      component: ChangeRoleComponent
    }, {
      path: 'delete',
      component: DeleteAccountComponent
    }]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
