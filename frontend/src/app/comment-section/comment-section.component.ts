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
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget neque nibh. Integer a sapien id' +
          ' arcu semper sollicitudin ut non odio. Nullam eu efficitur nibh.',
        creationDate: 'test creation date', },
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
