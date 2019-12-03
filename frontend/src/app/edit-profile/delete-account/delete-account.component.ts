import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {AuthService} from '../../auth/services/auth-service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  confirmation = false;

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
  }

  deleteAccount() {

    const userId = this.userService.getUserIdFromTokens(this.userService.getAccessToken());

    this.userService.deleteUser(userId).subscribe(
      (next) => {
        this.authService.logout();
      },
      (error) => {

      }
    );
  }

  showConfirmation() {
    this.confirmation = !this.confirmation;
  }
}
