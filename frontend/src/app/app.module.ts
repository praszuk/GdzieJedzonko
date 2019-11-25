import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PostsSectionComponent } from './posts-section/posts-section.component';
import { PostComponent } from './post/post.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ArticleComponent } from './article/article.component';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { CommentComponent } from './comment/comment.component';
import { HomeComponent } from './home/home.component';
import {AuthModule} from "./auth/auth.module";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {AdminPanelUserInfoComponent} from "./admin-panel-user-info/admin-panel-user-info.component";
import { AdminPanelUserSelectionComponent } from './admin-panel-user-selection/admin-panel-user-selection.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    PostsSectionComponent,
    PostComponent,
    FooterComponent,
    PageNotFoundComponent,
    ArticleComponent,
    CommentSectionComponent,
    CommentComponent,
    HomeComponent,
    UserProfileComponent,
    AdminPanelUserInfoComponent,
    AdminPanelUserSelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
