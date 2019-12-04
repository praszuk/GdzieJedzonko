import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-admin-panel-user-selection',
  templateUrl: './admin-panel-user-section.component.html',
  styleUrls: ['./admin-panel-user-section.component.css']
})
export class AdminPanelUserSectionComponent implements OnInit {
  users: User[];
  isLoading = false;
  constructor(private loadingService: NgxSpinnerService) { }

  ngOnInit() {
    this.loadingService.show('admin-panel-user-section');
    this.loadingService.hide('admin-panel-user-section');
  }
}
