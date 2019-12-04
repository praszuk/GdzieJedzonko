import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/services/auth-service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Role} from '../models/role.enum';
import {User} from '../models/user.model';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  loggedIn: boolean;
  isModerator: boolean;
  isAdmin: boolean;
  user: User;
  userSubscription: Subscription;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userSubscription = this.authService
                                    .getUserSubject()
                                    .subscribe(
                                      user => {
                                        if (user != null) {

                                          this.user = user;
                                          this.loggedIn = true;
                                          this.isAdmin = user.role === Role.ADMIN;
                                        } else {
                                          if (this.authService.isLoggedIn()) {
                                            this.authService.getCurrentUserById()
                                              .subscribe(
                                                user => {
                                                  this.user = user;
                                                  this.loggedIn = true;
                                                  this.isAdmin = user.role === Role.ADMIN;
                                                }
                                              );
                                          } else {
                                            this.user = null;
                                            this.loggedIn = false;
                                            this.isAdmin = false;
                                          }
                                        }
                                      }
                                    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.loggedIn = false;
    this.router.navigate(['/home']);
  }




}
