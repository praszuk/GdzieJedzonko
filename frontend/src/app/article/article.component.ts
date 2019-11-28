import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ArticleService} from '../services/article/article.service';
import {Article} from '../models/article.model';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit, OnDestroy {
  articleId: number;
  article: Article;
  subscription: any;
  constructor(private Activatedroute: ActivatedRoute, private articleService: ArticleService) { }

  ngOnInit() {
    this.subscription = this.Activatedroute.paramMap.subscribe(params => {
      this.articleId = +params.get('id');
      }
    );

    this.getArticle(this.articleId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getArticle(articleId: number) {
    this.articleService.getArticle(articleId).subscribe(
      (article) => {
        this.article = article;
      },
      (error) => {
      }
    );
  }

}
