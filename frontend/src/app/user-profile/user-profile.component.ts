import { Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
 subsription;
 userId: string;
 user: User;
  constructor(private Activatedroute: ActivatedRoute) {  }

  ngOnInit() {
    this.subsription = this.Activatedroute.paramMap.subscribe( params => {
        this.userId = params.get('id');
      }
    );
    this.getUserById(this.userId);
  }

  getUserById(userId){
    this.user = {id:1,firstName:"first",email:"a@w.pl",lastName:"last",birthDate:"2000-11-11",joinDate:"2019-11-11",password:"11"};
  }

  ngOnDestroy() {
    this.subsription.unsubscribe();
  }

}
