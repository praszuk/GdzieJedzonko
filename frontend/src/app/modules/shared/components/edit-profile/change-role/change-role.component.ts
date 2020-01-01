import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../../../services/user/user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.css']
})
export class ChangeRoleComponent implements OnInit {
  roles = ['Użytkownik', 'Moderator', 'Admin'];
  selectedRole: string;
  submitSuccess: boolean;
  submitError: boolean;
  private userId: number;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.selectedRole = this.roles[0];
    this.userId = this.activatedRoute.parent.snapshot.params.id;
  }

  onSubmit() {
    const role = this.roles.indexOf(this.selectedRole) + 1;

    this.userService.editUser(this.userId, {role}).subscribe(
      (next) => {
        this.submitError = false;
        this.submitSuccess = true;
      },
      (error) => {
        this.submitSuccess = false;
        this.submitError = true;
      }
    );
  }

  select(role: string) {
    this.selectedRole = role;
  }
}
