import { Component, OnInit } from '@angular/core';
import {Post} from '../models/post.model';

@Component({
  selector: 'app-posts-section',
  templateUrl: './posts-section.component.html',
  styleUrls: ['./posts-section.component.css']
})
export class PostsSectionComponent implements OnInit {
  posts: Post [];

  constructor() {  }

  ngOnInit() {
  }


}
