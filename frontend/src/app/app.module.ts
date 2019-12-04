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
import {AuthModule} from './auth/auth.module';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {AdminPanelUserInfoComponent} from './admin-panel-user-info/admin-panel-user-info.component';
import { AdminPanelUserSectionComponent } from './admin-panel-user-section/admin-panel-user-section.component';
import { NewReviewComponent } from './new-review/new-review.component';
import {QuillModule} from 'ngx-quill';
import {NgxSpinnerModule} from 'ngx-spinner';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { BasicInformationComponent } from './edit-profile/basic-information/basic-information.component';
import { ChangePasswordComponent } from './edit-profile/change-password/change-password.component';
import { DeleteAccountComponent } from './edit-profile/delete-account/delete-account.component';
import { StickySidebarComponent } from './sticky-sidebar/sticky-sidebar.component';
import { ChangeRoleComponent } from './edit-profile/change-role/change-role.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';


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
    AdminPanelUserSectionComponent,
    NewReviewComponent,
    EditProfileComponent,
    BasicInformationComponent,
    ChangePasswordComponent,
    DeleteAccountComponent,
    StickySidebarComponent,
    ChangeRoleComponent,
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
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
