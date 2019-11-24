import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel-user-info',
  templateUrl: './admin-panel-user-info.component.html',
  styleUrls: ['./admin-panel-user-info.component.css']
})
export class AdminPanelUserInfoComponent implements OnInit {
  email: string;
  first_name: string;
  last_name: string;
  birth_date;
  join_date;
  roles: string[];
  selectedRole = 'Rola';


  constructor() { }

  ngOnInit() {
    this.testValues();
  }

  testValues() {
    this.email = 'testowymail@wp.pl';
    this.first_name = 'Pan';
    this.last_name = 'Pawel';
    this.birth_date = '2000-01-01';
    this.join_date = '2019-01-01';
    this.roles = ['Moderator', 'Admin', 'User'];
  }

  selected(role: string){
    this.selectedRole = role;
  }

}
