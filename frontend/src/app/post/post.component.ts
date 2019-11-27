import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../models/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  articleId = 1;

  constructor() { }

  ngOnInit() {
  }

}
