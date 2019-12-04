import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sticky-sidebar',
  templateUrl: './sticky-sidebar.component.html',
  styleUrls: ['./sticky-sidebar.component.css']
})
export class StickySidebarComponent implements OnInit {
  @Input() options;

  activeTab: string;


  constructor() { }

  ngOnInit() {
    this.activeTab = this.options[0].name;
  }

  setActiveTab(name: string) {
    this.activeTab = name;
  }
}
