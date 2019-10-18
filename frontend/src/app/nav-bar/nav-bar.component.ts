import {Component, HostBinding, OnInit} from '@angular/core';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  loggedIn = true;
  username = 'Test username';
  constructor() { }

  ngOnInit() {
  }
}
