import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel-user-info',
  templateUrl: './admin-panel-user-info.component.html',
  styleUrls: ['./admin-panel-user-info.component.css']
})
export class AdminPanelUserInfoComponent implements OnInit {
  email: string;
  // tslint:disable-next-line:variable-name
  first_name: string;
  // tslint:disable-next-line:variable-name
  last_name: string;
  // tslint:disable-next-line:variable-name
  birth_date;
  // tslint:disable-next-line:variable-name
  join_date;



  constructor() { }

  ngOnInit() {
    this.testValues();
  }

  testValues() {
    this.email = 'testowymail@wp.pl';
    // tslint:disable-next-line:max-line-length
    this.first_name = 'Pan';
    this.last_name = 'Pawel';
    this.birth_date = '2000-01-01';
    this.join_date = '2019-01-01';
  }

}
