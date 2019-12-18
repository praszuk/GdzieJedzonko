import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../models/post.model';
import {ArticleService} from '../../services/article/article.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-posts-section',
  templateUrl: './posts-section.component.html',
  styleUrls: ['./posts-section.component.css']
})
export class PostsSectionComponent implements OnInit {
  @Input() userId?: number;
  posts: Post[] = [];
  isError = false;
  isLoading = true;
  constructor(private articleService: ArticleService, private loadingService: NgxSpinnerService) {  }

  ngOnInit() {
    this.loadingService.show('posts-section-loading');
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
        // this.posts = posts;
        let i = 0;
        const timer = setInterval(() => {
          if (i < posts.length) {
            this.posts.push(posts[i]);
            i++;
          } else {
            clearInterval(timer);
          }
        }, 70);
        this.isLoading = false;
        this.loadingService.hide('posts-section-loading');
      },
      (error) => {
        this.isError = true;
      }
    );
  }

  getAllArticles() {
    this.articleService.getAllArticles().subscribe(
      (posts) => {
        this.isError = false;
        // this.posts = posts;
        let i = 0;
        const timer = setInterval(() => {
            if (i < posts.length) {
              this.posts.push(posts[i]);
              i++;
            } else {
              clearInterval(timer);
            }
          }, 50);

        this.isLoading = false;
        this.loadingService.hide('posts-section-loading');
      },
      (error) => {
        this.isError = true;
      }
    );
  }

}
