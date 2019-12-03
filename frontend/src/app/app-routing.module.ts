import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostsSectionComponent} from './posts-section/posts-section.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ArticleComponent} from './article/article.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth/guards/AuthGuard';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {AdminPanelUserSectionComponent} from './admin-panel-user-section/admin-panel-user-section.component';
import {NewReviewComponent} from './new-review/new-review.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {BasicInformationComponent} from './edit-profile/basic-information/basic-information.component';
import {ChangePasswordComponent} from './edit-profile/change-password/change-password.component';
import {DeleteAccountComponent} from './edit-profile/delete-account/delete-account.component';
import {ChangeRoleComponent} from './edit-profile/change-role/change-role.component';


const routes: Routes = [ {
  path: 'login',
  component: LoginComponent,
  canActivate: [AuthGuard]
  }, {
  path: 'register',
  component: RegisterComponent,
  canActivate: [AuthGuard]
  }, {
  path: '',
  component: HomeComponent,
  children: [{
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }, {
    path: 'home',
    component: PostsSectionComponent
  }, {
    path: 'article/:id',
    component: ArticleComponent
  }, {
    path: 'newreview',
    component: NewReviewComponent
  }, {
    path: 'editprofile',
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
      path: 'delete',
      component: DeleteAccountComponent
    }]
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
  }, {
    path: 'userprofile/:id',
    component: UserProfileComponent
  }, {
    path: 'admin',
    component: AdminPanelUserSectionComponent
  }, {
    path: '404',
    component: PageNotFoundComponent
  }, {
    path: '**',
    redirectTo: '/404'
  }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
