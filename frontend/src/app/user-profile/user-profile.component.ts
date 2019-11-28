import { Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
 subscription;
 userId: number;
 user: User;
  constructor(private Activatedroute: ActivatedRoute) {  }

  ngOnInit() {
    this.subscription = this.Activatedroute.paramMap.subscribe(params => {
        this.userId = +params.get('id');
      }
    );

    this.getUserById(this.userId);
  }

  getUserById(userId){
    this.user = {id:1,first_name:"first",email:"a@w.pl",last_name:"last",birth_date:"2000-11-11",join_date:"2019-11-11",role: 1};
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
