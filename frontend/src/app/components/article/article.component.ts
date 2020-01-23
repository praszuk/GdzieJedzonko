import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleService} from '../../services/article/article.service';
import {Article} from '../../models/article.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from '../../modules/auth/services/auth-service';
import {Role} from '../../models/role.enum';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

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
  showOptionButtons = false;
  showGallery: boolean;

  galleryOptions: Array<NgxGalleryOptions> = [];
  galleryImages: Array<NgxGalleryImage> = [];
  coordinates: any;

  constructor(private activatedroute: ActivatedRoute,
              private articleService: ArticleService,
              private loadingService: NgxSpinnerService,
              private authService: AuthService,
              private router: Router,
              private location: Location
  ) {
  }

  ngOnInit() {
    this.loadingService.show('articleLoading');
    this.subscription = this.activatedroute.paramMap.subscribe(params => {
        this.articleId = +params.get('id');
      }
    );
    this.getArticle(this.articleId);
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getArticle(articleId: number) {
    this.articleService.getArticle(articleId).subscribe(
      (article) => {
        this.coordinates = {lat: article.restaurant.lat, lon: article.restaurant.lon}
        this.article = article;
        this.isLoading = false;
        this.loadingService.hide('articleLoading');
        this.isOwner();
        this.setGalleryImages();
      },
      (error) => {
      }
    );
  }

  isOwner() {
    if (this.authService.isLoggedIn()) {
      const isAuthor = this.authService.getCurrentUserId() === this.article.user.id;
      const userRole = this.authService.getRoleFromTokens();
      if (isAuthor || userRole === Role.MODERATOR || userRole === Role.ADMIN) {
        this.showOptionButtons = true;
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

  setGalleryImages() {
    if (this.article.thumbnail) {
      this.galleryImages.push(
        {
          small: this.article.thumbnail.image,
          medium: this.article.thumbnail.image,
          big: this.article.thumbnail.image
        }
      );

      this.article.photos.forEach(
        (image) => {
          this.galleryImages.push(
            {
              small: image.image,
              medium: image.image,
              big: image.image
            });
        }
      );
      this.showGallery = true;
    }
  }

  previousPage() {
    this.location.back();
  }
}

