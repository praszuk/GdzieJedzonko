import { Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../models/user.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
 subscription;
 userId: number;
 user: User;
 isLoading = true;
  constructor(private Activatedroute: ActivatedRoute, private loadingService: NgxSpinnerService) {  }

  ngOnInit() {
    this.loadingService.show();
    this.subscription = this.Activatedroute.paramMap.subscribe(params => {
        this.userId = +params.get('id');
      }
    );
    this.getUserById(this.userId);
  }

  getUserById(userId) {

    this.user = {id: 1, last_name: 'asdf', first_name: 'df', role: 1, email: '123', birth_date: '34343', join_date: '232'};

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
