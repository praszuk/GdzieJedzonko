import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../../services/user/user.service';
import {AuthService} from '../../../../auth/services/auth-service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  confirmation = false;
  private isAdmin: boolean;

  constructor(private userService: UserService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.isAdmin = this.activatedRoute.parent.snapshot.params.id !== undefined;
  }

  deleteAccount() {
    if (this.isAdmin) {
      const userId = this.activatedRoute.parent.snapshot.params.id;
      this.deleteUser(userId);

    } else {
     this.deleteMyProfile();
    }
  }

  showConfirmation() {
    this.confirmation = !this.confirmation;
  }

  deleteMyProfile() {
    const userId = this.userService.getUserIdFromTokens(this.userService.getAccessToken());

    this.userService.deleteUser(userId).subscribe(
      (next) => {
        this.authService.logout();
      },
      (error) => {

      }
    );
  }

  deleteUser(userId: number) {


    this.userService.deleteUser(userId).subscribe(
      (next) => {
        this.router.navigate(['admin']);
      },
      (error) => {

      }
    );
  }
}
