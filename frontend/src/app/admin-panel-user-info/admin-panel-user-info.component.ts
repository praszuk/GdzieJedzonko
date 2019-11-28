import {Component, Input, OnInit} from '@angular/core';
import {User} from '../models/user.model';

@Component({
  selector: 'app-admin-panel-user-info',
  templateUrl: './admin-panel-user-info.component.html',
  styleUrls: ['./admin-panel-user-info.component.css']
})
export class AdminPanelUserInfoComponent implements OnInit {
  @Input() user: User;
  roles: string[];
  selectedRole = 'Rola';


  constructor() { }

  ngOnInit() {
    this.roles = ['1', '2', '3'];
  }

  selected(role: string) {
    this.selectedRole = role;
  }

}
