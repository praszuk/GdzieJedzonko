import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../../models/user.model';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material';
import {UserService} from '../../../../services/user/user.service';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {MatRipple} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-admin-panel-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  userDataSource: MatTableDataSource<User>;
  subscription: Subscription;

  roles = ['Gość', 'Użytkownik', 'Moderator', 'Admin'];
  displayedColumns = ['id', 'email', 'first_name', 'last_name', 'birth_date', 'date_joined', 'role'];

  @ViewChild(MatPaginator, {static: true} ) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatRipple, {static: true}) ripple: MatRipple;

  selectedRowIndex: number;

  constructor(private userService: UserService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userDataSource = new MatTableDataSource();
    this.userDataSource.sort = this.sort;
    this.userDataSource.paginator = this.paginator;
    this.getAllUsers();
  }

  getAllUsers() {
    this. subscription = this.userService.getAllUsers().subscribe(
      (users) => {
        this.userDataSource.data = users;
      },
      (error) => {
        this.snackBar.open('Pobranie użytkowników nie powiodło się, spróbuj ponownie', '', {
          duration: 3000
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  applyFilter(filter: string) {
    this.userDataSource.filter = filter.trim().toLowerCase();
  }

  selectRow(row: User) {
    this.selectedRowIndex = row.id;
  }


}
