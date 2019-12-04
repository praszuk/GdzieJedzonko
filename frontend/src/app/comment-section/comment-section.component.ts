import { Component, OnInit } from '@angular/core';
import {Comment} from '../models/comment.model';
import { NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {
  comments: Comment [];
  isLoading = true;
  constructor(private loadingService: NgxSpinnerService) { }

  ngOnInit() {
    this.loadingService.show('comments-section-loading');
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
          date_joined: 'testJoindate1',
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
          date_joined: 'testJoindate2',
          role: 1
        },
        comment: 'Test comment 2',
        creationDate: 'test creation date',}
  ];
  }

}
