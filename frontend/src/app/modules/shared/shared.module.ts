import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditProfileComponent} from './components/edit-profile/edit-profile.component';
import {DeleteAccountComponent} from './components/edit-profile/delete-account/delete-account.component';
import {ChangeRoleComponent} from './components/edit-profile/change-role/change-role.component';
import {ChangePasswordComponent} from './components/edit-profile/change-password/change-password.component';
import {BasicInformationComponent} from './components/edit-profile/basic-information/basic-information.component';
import {StickySidebarComponent} from './components/sticky-sidebar/sticky-sidebar.component';
import {RouterModule} from "@angular/router";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    EditProfileComponent,
    DeleteAccountComponent,
    ChangeRoleComponent,
    ChangePasswordComponent,
    BasicInformationComponent,
    StickySidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    EditProfileComponent,
    DeleteAccountComponent,
    ChangeRoleComponent,
    ChangePasswordComponent,
    BasicInformationComponent,
    StickySidebarComponent
  ]
})
export class SharedModule { }
