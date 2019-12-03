import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  options: any;


  constructor() { }

  ngOnInit() {
   this.options = this.setOptions();
  }

  private setOptions() {
    return [{
        name: 'Podstawowe informacje',
        url: 'basic-information'
      }, {
        name: 'Zmień hasło',
        url: 'password'
      }, {
        name: 'Usuń konto',
        url: 'delete'
      }];
  }
}
