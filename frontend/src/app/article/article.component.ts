import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ArticleService} from '../services/article/article.service';
import {Article} from '../models/article.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit, OnDestroy {
  articleId: number;
  article: Article;
  subscription: any;
  isLoading = true;
  constructor(private activatedroute: ActivatedRoute,
              private articleService: ArticleService,
              private loadingService: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.loadingService.show('articleLoading');
    this.subscription = this.activatedroute.paramMap.subscribe(params => {
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
        this.isLoading = false;
        this.loadingService.hide('articleLoading');
      },
      (error) => {
      }
    );
  }

}
