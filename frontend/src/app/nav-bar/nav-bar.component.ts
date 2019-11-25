import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/services/auth-service';
import { Subscription} from 'rxjs';
import {Router} from '@angular/router';



@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  loggedIn: boolean;
  username: string;
  userSubscription: Subscription;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userSubscription = this.authService
                                    .getUserSubject()
                                    .subscribe(
                                      user => {
                                        if (user != null) {

                                          this.username = `${user.first_name} ${user.last_name}`;
                                          this.loggedIn = true;
                                        } else {
                                          if (this.authService.isLoggedIn()) {
                                            this.authService.getCurrentUserById()
                                              .subscribe(
                                                user => {
                                                  this.username = `${user.first_name} ${user.last_name}`;
                                                  this.loggedIn = true;
                                                }
                                              );
                                          } else {
                                            this.username = '';
                                            this.loggedIn = false;
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
