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

    this.users = [{
      id: 1,
      email: 'testowymail@wp.pl',
      first_name: 'Pawel',
      last_name: 'Pan',
      birth_date: '2000-01-01',
      join_date: '2019-01-01',
      role: 1,
    }, {
      id: 2,
      email: 'xxxxxx@wp.pl',
      first_name: 'KEKW',
      last_name: 'Pepega',
      birth_date: '2000-01-01',
      join_date: '2019-01-01',
      role: 2,
    }, {
      id: 3,
      email: 'test@wp.pl',
      first_name: 'sthyrtyeyt',
      last_name: 'rgsdgsdfg',
      birth_date: '2000-01-01',
      join_date: '2019-01-01',
      role: 2,
    }, {
      id: 4,
      email: 'dawda@wp.pl',
      first_name: 'wwwww',
      last_name: 'aaaaa',
      birth_date: '2000-01-01',
      join_date: '2019-01-01',
      role: 3,
    }];
  }

}
