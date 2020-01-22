import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditProfileComponent} from './components/edit-profile/edit-profile.component';
import {DeleteAccountComponent} from './components/edit-profile/delete-account/delete-account.component';
import {ChangeRoleComponent} from './components/edit-profile/change-role/change-role.component';
import {ChangePasswordComponent} from './components/edit-profile/change-password/change-password.component';
import {BasicInformationComponent} from './components/edit-profile/basic-information/basic-information.component';
import {StickySidebarComponent} from './components/sticky-sidebar/sticky-sidebar.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PendingRestaurantsComponent } from './components/pending-restaurants/pending-restaurants.component';
import {EditRestaurantDialogComponent} from './components/pending-restaurants/dialogs/edit-restaurant-dialog/edit-restaurant-dialog.component';
import {LocationMapDialogComponent} from './components/pending-restaurants/dialogs/location-map-dialog/location-map-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MapComponent} from './components/map/map.component';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';



@NgModule({
  declarations: [
    EditProfileComponent,
    DeleteAccountComponent,
    ChangeRoleComponent,
    ChangePasswordComponent,
    BasicInformationComponent,
    StickySidebarComponent,
    PendingRestaurantsComponent,
    EditRestaurantDialogComponent,
    LocationMapDialogComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSortModule,
    MatRippleModule,
    MatPaginatorModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    LeafletModule,
  ],
  exports: [
    EditProfileComponent,
    DeleteAccountComponent,
    ChangeRoleComponent,
    ChangePasswordComponent,
    BasicInformationComponent,
    StickySidebarComponent,
    PendingRestaurantsComponent,
    EditRestaurantDialogComponent,
    LocationMapDialogComponent,
    MapComponent
  ],
  entryComponents: [
    EditRestaurantDialogComponent,
    LocationMapDialogComponent
  ]
})
export class SharedModule { }
