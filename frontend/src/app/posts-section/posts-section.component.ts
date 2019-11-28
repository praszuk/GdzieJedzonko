import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../models/post.model';
import {ArticleService} from '../services/article/article.service';

@Component({
  selector: 'app-posts-section',
  templateUrl: './posts-section.component.html',
  styleUrls: ['./posts-section.component.css']
})
export class PostsSectionComponent implements OnInit {
  @Input() userId?: number;
  posts: Post[];
  isError = false;
  constructor(private articleService: ArticleService) {  }

  ngOnInit() {
    if (this.userId) {
      this.getUserArticles(this.userId);
    } else {
      this.getAllArticles();
    }
  }

  getUserArticles(userId: number) {
    this.articleService.getUserArticles(userId).subscribe(
      (posts) => {
        this.isError = false;
        this.posts = posts;
      },
      (error) => {
        this.isError = true;
      }
    );
  }

  getAllArticles() {
    this.articleService.getAllArticles().subscribe(
      (next) => {
        this.isError = false;
        this.posts = next;
      },
      (error) => {
        this.isError = true;
      }
    );
  }

}
