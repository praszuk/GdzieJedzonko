import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  options: any;
  isAdmin: boolean;


  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.isAdmin = this.activatedRoute.snapshot.params.id !== undefined;
    if (this.isAdmin) {
        this.options = this.setAdminOptions();
      } else {
        this.options = this.setUserOptions();
      }
  }

  private setUserOptions() {
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

  private setAdminOptions() {
    return [{
      name: 'Podstawowe informacje',
      url: 'basic-information'
    }, {
      name: 'Zmień hasło',
      url: 'password'
    }, {
      name: 'Zmień role',
      url: 'role'
    }, {
      name: 'Usuń konto',
      url: 'delete'
    }];
  }
}
