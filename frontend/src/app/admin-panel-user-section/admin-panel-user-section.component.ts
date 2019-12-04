import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserService} from '../services/user/user.service';

@Component({
  selector: 'app-admin-panel-user-selection',
  templateUrl: './admin-panel-user-section.component.html',
  styleUrls: ['./admin-panel-user-section.component.css']
})
export class AdminPanelUserSectionComponent implements OnInit {
  users: User[];
  isLoading = true;
  constructor(private loadingService: NgxSpinnerService, private userService: UserService) { }

  ngOnInit() {
    this.loadingService.show('admin-panel-user-section');
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
        this.loadingService.hide('admin-panel-user-section');
        this.isLoading = false;
      },
      (error) => {
        this.loadingService.show('admin-panel-user-section');
        this.isLoading = true;
      }
    );
  }
}
