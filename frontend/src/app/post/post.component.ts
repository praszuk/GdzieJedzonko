import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../models/post.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  animations: [
    trigger('slideIn', [
      state('false', style({
        transform: 'translateY(500px)',
        opacity: 0
      })),
      state('true', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('true <=> false', animate('900ms ease-in-out'))
    ])
  ]
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  thumbnail: string;
  postState = false;
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.postState = true;
    }, 100);

    if (this.post.thumbnail) {
      this.thumbnail = this.post.thumbnail;
    } else {
      this.thumbnail = 'assets/images/no-image.svg';
    }
  }

}
