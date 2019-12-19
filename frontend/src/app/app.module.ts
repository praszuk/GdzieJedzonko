import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PostsSectionComponent } from './components/posts-section/posts-section.component';
import { PostComponent } from './components/post/post.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ArticleComponent } from './components/article/article.component';
import { CommentSectionComponent } from './components/comment-section/comment-section.component';
import { CommentComponent } from './components/comment/comment.component';
import { HomeComponent } from './components/home/home.component';
import {AuthModule} from './modules/auth/auth.module';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import { NewReviewComponent } from './components/new-review/new-review.component';
import {QuillModule} from 'ngx-quill';
import {NgxSpinnerModule} from 'ngx-spinner';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import {AdminModule} from './modules/admin/admin.module';
import {SharedModule} from './modules/shared/shared.module';
import {MatButtonModule} from "@angular/material/button";


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
    NewReviewComponent,
    ImageUploadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    QuillModule.forRoot(),
    NgxSpinnerModule,
    AdminModule,
    SharedModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
