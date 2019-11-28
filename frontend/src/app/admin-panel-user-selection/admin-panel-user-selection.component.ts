import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';

@Component({
  selector: 'app-admin-panel-user-selection',
  templateUrl: './admin-panel-user-selection.component.html',
  styleUrls: ['./admin-panel-user-selection.component.css']
})
export class AdminPanelUserSelectionComponent implements OnInit {
  users: User[];

  constructor() { }

  ngOnInit() {
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
