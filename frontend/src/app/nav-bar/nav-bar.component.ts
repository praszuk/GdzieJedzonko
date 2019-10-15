import { Component, OnInit } from '@angular/core';
import {fromEvent} from "rxjs";

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  loggedIn: boolean = false;
  username: string = 'Test username';

  constructor() { }

  ngOnInit() {
    const scroll$ = fromEvent(window, 'scroll');
  }

}
