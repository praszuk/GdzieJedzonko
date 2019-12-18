import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css']
})
export class MainPanelComponent implements OnInit {

  options: any;
  constructor() { }

  ngOnInit() {
    this.options = this.setAdminOptions();
  }


  private setAdminOptions() {
    return [{
      name: 'Użytkownicy',
      url: 'users'
    }, {
      name: 'Oczekujące recenzje',
      url: 'pending-reviews'
    }];
  }

}
