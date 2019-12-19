import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleService} from '../../services/article/article.service';
import {Article} from '../../models/article.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from '../../modules/auth/services/auth-service';
import {Role} from '../../models/role.enum';

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
  showDelete = false;

  constructor(private activatedroute: ActivatedRoute,
              private articleService: ArticleService,
              private loadingService: NgxSpinnerService,
              private authService: AuthService,
              private router: Router
  ) {
  }

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
        this.showDeleteButton();
      },
      (error) => {
      }
    );
  }

  private showDeleteButton() {
    if (this.authService.isLoggedIn()) {
      const isAuthor = this.authService.getCurrentUserId() === this.article.user.id;
      const userRole = this.authService.getRoleFromTokens();
      if (isAuthor || userRole === Role.MODERATOR || userRole === Role.ADMIN) {
        this.showDelete = true;
      }
    }
  }


  deleteArticle() {
    this.articleService.deleteArticle(this.articleId).subscribe(
      (response) => {
        this.router.navigate(['/home']);
      },
      (error) => {
        // todo popup something went wrong
      });
  }
}

