import { Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {User} from '../user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
 subsription;
 userId: string;
 user: User;
  constructor(private Activatedroute: ActivatedRoute) {  }

  ngOnInit() {
    this.subsription = this.Activatedroute.paramMap.subscribe( params => {
        this.userId = params.get('id');
      }
    );
  }

  ngOnDestroy() {
    this.subsription.unsubscribe();
  }

}
