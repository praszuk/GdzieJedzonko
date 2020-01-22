import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {ArticleComponent} from './components/article/article.component';
import {RegisterComponent} from './modules/auth/components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './modules/auth/components/login/login.component';
import {AuthGuard} from './modules/auth/guards/AuthGuard';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {NewReviewComponent} from './components/new-review/new-review.component';
import {EditProfileComponent} from './modules/shared/components/edit-profile/edit-profile.component';
import {BasicInformationComponent} from './modules/shared/components/edit-profile/basic-information/basic-information.component';
import {ChangePasswordComponent} from './modules/shared/components/edit-profile/change-password/change-password.component';
import {DeleteAccountComponent} from './modules/shared/components/edit-profile/delete-account/delete-account.component';
import {UserGuard} from './modules/auth/guards/user.guard';
import {AdminGuard} from './modules/auth/guards/admin.guard';
import {EditReviewComponent} from './components/edit-review/edit-review.component';
import {OwnerGuard} from './modules/auth/guards/owner.guard';
import {MainPageComponent} from './components/main-page/main-page.component';
import {ModeratorViewComponent} from './components/moderator-view/moderator-view.component';
import {ModeratorGuard} from './modules/auth/guards/moderator.guard';


const routes: Routes = [{
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
    component: MainPageComponent
  }, {
    path: 'article/:id',
    component: ArticleComponent
  }, {
    path: 'newreview',
    component: NewReviewComponent,
    canActivate: [UserGuard]
  }, {
    path: 'editprofile',
    component: EditProfileComponent,
    canActivate: [UserGuard],
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
    path: 'editreview/:id',
    component: EditReviewComponent,
    canActivate: [OwnerGuard]
  }, {
    path: 'userprofile/:id',
    component: UserProfileComponent,
    canActivate: [UserGuard]
  }, {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(module => module.AdminModule),
    canLoad: [AdminGuard],
  }, {
    path: 'moderator',
    component: ModeratorViewComponent,
    canActivate: [ModeratorGuard]
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
export class AppRoutingModule {
}
