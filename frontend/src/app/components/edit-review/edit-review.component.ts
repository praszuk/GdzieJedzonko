import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImageUploadComponent} from '../image-upload/image-upload.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ArticleService} from '../../services/article/article.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Article} from '../../models/article.model';
import {Image} from '../../models/image.model';
import {MapComponent} from '../../modules/shared/components/map/map.component';
import {Restaurant} from '../../models/restaurant.model';
import {City} from '../../models/city.model';
import {MatDialog} from '@angular/material/dialog';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CityService} from '../../services/city/city.service';

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.css']
})
export class EditReviewComponent implements OnInit, OnDestroy {

  @ViewChild(ImageUploadComponent, {static: false}) imageUpload: ImageUploadComponent;
  @ViewChild(MapComponent, {static: false}) map: MapComponent;
  uploadedThumbnail: Image = null;
  uploadedImages: Image[] = null;
  editorForm: FormGroup;
  titleExists = false;
  subscription: Subscription = null;
  article: Article;
  articleId: number;
  restaurant: Restaurant;
  coordinates = null;
  getAllCitiesSubscription: Subscription;
  cities: City[];
  cityIndex: number;
  articleLength: number;

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{header: 1}, {header: 2}],               // custom button values
    [{list: 'ordered'}, {list: 'bullet'}],
    [{script: 'sub'}, {script: 'super'}],      // superscript/subscript
    [{indent: '-1'}, {indent: '+1'}],          // outdent/indent
    [{direction: 'rtl'}],                         // text direction

    [{size: ['small', false, 'large', 'huge']}],  // custom dropdown
    [{header: [1, 2, 3, 4, 5, 6, false]}],

    [{color: []}, {background: []}],          // dropdown with defaults from theme
    [{font: []}],
    [{align: []}],

    ['clean']                                         // remove formatting button
  ];

  editorStyle = {
    height: '70vh'
  };

  modules = {
    toolbar: this.toolbarOptions
  };


  constructor(private formBuilder: FormBuilder,
              private articleService: ArticleService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private cityService: CityService) {
  }

  ngOnInit() {
    this.editorForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[\\w\\,\\.\\-\\!\\?\\d\\s]+$'), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(3000)]],
      rating: ['', [Validators.required]]
    });
    this.articleId = +this.activatedRoute.snapshot.params.id;
    this.getAllCities();
  }

  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    const article = this.editorForm.value;
    article.content = JSON.parse(this.editorForm.value.content);
    this.subscription = this.articleService.updateArticle(this.articleId, article).subscribe(
      (id) => {
        this.titleExists = false;
        this.imageUpload.uploadImages(this.articleId);
      },
      error => {
        if (error.error.title !== undefined) {
          this.titleExists = true;
        }
      });
  }

  setArticleContent() {
    this.editorForm.get('title').setValue(this.article.title);
    this.editorForm.get('content').setValue(this.article.content);
    this.editorForm.get('rating').setValue(this.article.rating);
    this.restaurant = this.article.restaurant;
    this.cityIndex = this.cities.map(value => value.id).indexOf(this.restaurant.city);
    this.coordinates = {lat: this.restaurant.lat, lon: this.restaurant.lon};

    if (this.article.thumbnail) {
      this.uploadedThumbnail = this.article.thumbnail;
      if (this.article.photos) {
        this.uploadedImages = this.article.photos;
      }
    }
  }


  getArticle(articleId: number) {
    this.articleService.getArticle(articleId).subscribe(
      (article) => {
        this.article = article;
        this.setArticleContent();
      },
      (error) => {
        this.snackBar.open(`Pobieranie recenzji do edycji nie powiodło się`, '', {
          duration: 3000
        });
      }
    );
  }

  textChanged($event: { content: any; delta: any; editor: any; html: string | null; oldDelta: any; source: string; text: string }) {
    this.articleLength = $event.editor.getLength() - 1;
  }

  getAllCities() {
    this.getAllCitiesSubscription = this.cityService.getAllCities().subscribe(
      (cities: City[]) => {
        this.cities = cities;
        this.getArticle(this.articleId);
      },
      (error) => {
        this.snackBar.open('Pobranie miast się nie powiodło, spróbuj ponownie otworzyć to okno', '', {
          duration: 3000
        });
      }
    );
  }

}
