import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostsSectionComponent} from './posts-section/posts-section.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ArticleComponent} from './article/article.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";



const routes: Routes = [ {
  path:'login',
  component: LoginComponent,
  }, {
  path:'register',
  component: RegisterComponent,
  }, {
  path: '',
  component: HomeComponent,
  children:[{
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
    path: 'register',
    component: RegisterComponent
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
