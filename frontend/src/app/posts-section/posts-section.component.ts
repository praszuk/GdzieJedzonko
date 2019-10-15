import { Component, OnInit } from '@angular/core';
import {Post} from '../post';

@Component({
  selector: 'app-posts-section',
  templateUrl: './posts-section.component.html',
  styleUrls: ['./posts-section.component.css']
})
export class PostsSectionComponent implements OnInit {
  posts: Post [];

  constructor() {  }

  ngOnInit() {
    this.posts = [{
      id: 1,
      title: 'Test title',
      description: 'Test description',
      content: 'Test content',
      creationDate: '2019-10-15',
  }, {
      id: 2,
      title: 'Test title 2',
      description: 'Test description 2',
      content: 'Test content 2',
      creationDate: '2019-10-15',
    },{
      id: 1,
      title: 'Test title',
      description: 'Test description',
      content: 'Test content',
      creationDate: '2019-10-15',
    }, {
      id: 2,
      title: 'Test title 2',
      description: 'Test description 2',
      content: 'Test content 2',
      creationDate: '2019-10-15',
    },{
      id: 1,
      title: 'Test title',
      description: 'Test description',
      content: 'Test content',
      creationDate: '2019-10-15',
    }, {
      id: 2,
      title: 'Test title 2',
      description: 'Test description 2',
      content: 'Test content 2',
      creationDate: '2019-10-15',
    },{
      id: 1,
      title: 'Test title',
      description: 'Test description',
      content: 'Test content',
      creationDate: '2019-10-15',
    }, {
      id: 2,
      title: 'Test title 2',
      description: 'Test description 2',
      content: 'Test content 2',
      creationDate: '2019-10-15',
    }];
  }


}
