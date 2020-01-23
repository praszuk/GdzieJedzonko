import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserService} from '../../services/user/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
 subscription: Subscription;
 userId: number;
 user: User;
 isLoading = true;
  constructor(private Activatedroute: ActivatedRoute,
              private loadingService: NgxSpinnerService,
              private userService: UserService,
              private location: Location) {  }

  ngOnInit() {
    this.loadingService.show('userProfileLoading');
    this.subscription = this.Activatedroute.paramMap.subscribe(params => {
        this.userId = +params.get('id');
      }
    );
    this.getUserById(this.userId);
  }

  getUserById(userId: number) {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        this.user = user;
        this.loadingService.hide('userProfileLoading');
        this.isLoading = false;
      },
      (error) => {
        this.loadingService.show('userProfileLoading');
        this.isLoading = true;
      }
    );
  }

  previousPage() {
    this.location.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
