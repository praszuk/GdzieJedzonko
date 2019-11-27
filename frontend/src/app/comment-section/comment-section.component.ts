import { Component, OnInit } from '@angular/core';
import {Comment} from '../models/comment.model';
import {User} from '../models/user.model';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {
  comments: Comment [];
  constructor() { }

  ngOnInit() {
    this.dummyData();
  }

  dummyData() {
    this.comments = [{
        id: 1,
        user: {
          id: 1,
          email: 'test1@gmail.com',
          first_name: 'testName1',
          last_name: 'testSurName1',
          birth_date: 'testdate1',
          join_date: 'testJoindate1',
          role: 1
        },
        comment: 'vitae, volutpat sit amet erat. Aenean ac magna laoreet, pellentesque diam eget, interdum mi. Cras sed eleifend neque. Nam sit amet eros sit amet lacus semper malesuada. Vestibulum a ante non lorem maximus rhoncus non ut risus. Etiam pellentesque neque non est dictum, non facilisis dui vestibulum. Praesent lobortis, urna vitae condimentum egestas, ipsum lacus viverra turpis, commodo cursus turpis sem non tellus. Duis placerat leo et diam sollicitudin malesuada. Suspendisse tempus accumsan aliquam. Maecenas nunc nisi, malesuada vel lorem nec, accumsan varius felis. Nam iaculis eros vitae imperdiet volutpat. Suspendisse orci sem, aliquet sit amet congue nec, euismod id nulla. Vestibulum scelerisque quam ultricies ligula mattis, vitae posuere mauris gravida. Aenean gravida facilisis arcu, ut venenatis lacus luctus nec. Sed vel euismod dui. Etiam turpis magna, volutpat vitae mollis et, rutrum non ',
        creationDate: 'test creation date',},
      {
        id: 2,
        user: {
          id: 2,
          email: 'test2@gmail.com',
          first_name: 'testName2',
          last_name: 'testSurName2',
          birth_date: 'testdate2',
          join_date: 'testJoindate2',
          role: 1
        },
        comment: 'Test comment 2',
        creationDate: 'test creation date',}
  ];
  }

}
