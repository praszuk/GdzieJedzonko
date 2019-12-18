import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule, MatToolbarModule, MatSidenavModule, MatIconModule,
  MatListModule, MatSortModule, MatPaginatorModule} from '@angular/material';

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
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { BasicInformationComponent } from './edit-profile/basic-information/basic-information.component';
import { ChangePasswordComponent } from './edit-profile/change-password/change-password.component';
import { DeleteAccountComponent } from './edit-profile/delete-account/delete-account.component';
import { StickySidebarComponent } from './sticky-sidebar/sticky-sidebar.component';
import { ChangeRoleComponent } from './edit-profile/change-role/change-role.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {AdminModule} from './modules/admin/admin.module';


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
    NgxSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    AdminModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
