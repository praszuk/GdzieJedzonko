import {Component, Input, OnInit} from '@angular/core';
import {User} from '../models/user.model';

@Component({
  selector: 'app-admin-panel-user-info',
  templateUrl: './admin-panel-user-info.component.html',
  styleUrls: ['./admin-panel-user-info.component.css']
})
export class AdminPanelUserInfoComponent implements OnInit {
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
