import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PostsSectionComponent} from './components/posts-section/posts-section.component';
import {PostComponent} from './components/post/post.component';
import {FooterComponent} from './components/footer/footer.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {ArticleComponent} from './components/article/article.component';
import {CommentSectionComponent} from './components/comment-section/comment-section.component';
import {CommentComponent} from './components/comment/comment.component';
import {HomeComponent} from './components/home/home.component';
import {AuthModule} from './modules/auth/auth.module';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {NewReviewComponent} from './components/new-review/new-review.component';
import {QuillModule} from 'ngx-quill';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ImageUploadComponent} from './components/image-upload/image-upload.component';
import {AdminModule} from './modules/admin/admin.module';
import {SharedModule} from './modules/shared/shared.module';
import {MatButtonModule} from '@angular/material/button';
import {NgxGalleryModule} from 'ngx-gallery';
import {CustomHammerConfig} from './models/custom-hammer-config';
import {EditReviewComponent} from './components/edit-review/edit-review.component';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { AddRestaurantComponent } from './components/new-review/add-restaurant/add-restaurant.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ModeratorViewComponent } from './components/moderator-view/moderator-view.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRippleModule} from '@angular/material/core';

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
    EditReviewComponent,
    AddRestaurantComponent,
    MainPageComponent,
    ModeratorViewComponent,
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
    MatButtonModule,
    NgxGalleryModule,
    MatCardModule,
    MatSnackBarModule,
    LeafletModule.forRoot(),
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatRippleModule
  ],
  entryComponents: [
    AddRestaurantComponent,
  ],
  providers: [{provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
