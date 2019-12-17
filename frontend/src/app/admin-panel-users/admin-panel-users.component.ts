import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../models/user.model';
import {Role} from '../models/role.enum';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserService} from '../services/user/user.service';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-admin-panel-users',
  templateUrl: './admin-panel-users.component.html',
  styleUrls: ['./admin-panel-users.component.css']
})
export class AdminPanelUsersComponent implements OnInit {
  users: User[];
  dataSource: MatTableDataSource<any>;
  isLoading = true;
  searchKey: string;

  displayedColumns = ['id', 'email', 'first_name', 'last_name', 'birth_date', 'date_joined', 'role', 'actions'];
  @ViewChild(MatPaginator, {static: true} ) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private loadingService: NgxSpinnerService, private userService: UserService) { }

  ngOnInit() {

    this.testValues();
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;



    // this.loadingService.show('admin-panel-user-section');
    // this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
        this.loadingService.hide('admin-panel-user-section');
        this.isLoading = false;
      },
      (error) => {
        this.loadingService.show('admin-panel-user-section');
        this.isLoading = true;
      }
    );
  }

  private testValues() {
    this.users = [{
      id: 1,
      email: 'testowedane@wpwp.pl',
      first_name: 'Test',
      last_name: 'Kowalski',
      birth_date: '11-11-1111',
      date_joined: '22-22-2222',
      role: Role.ADMIN,
    }, {
      id: 2,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 3,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 4,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 5,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 6,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 7,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 8,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 9,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 10,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 11,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 12,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 13,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 14,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 15,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 16,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 17,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 18,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 19,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 20,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }, {
      id: 21,
      email: 'tujakismail@kwk.pl',
      first_name: 'Adam',
      last_name: 'Brzęczysz',
      birth_date: '33-33-3333',
      date_joined: '44-44-4444',
      role: Role.MODERATOR,
    }];
  }

}
