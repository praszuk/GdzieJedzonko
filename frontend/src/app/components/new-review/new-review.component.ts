import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ArticleService} from '../../services/article/article.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ImageUploadComponent} from '../image-upload/image-upload.component';
import {MatDialog} from '@angular/material/dialog';
import {AddRestaurantComponent} from './add-restaurant/add-restaurant.component';
import {Restaurant} from '../../models/restaurant.model';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapComponent} from '../../modules/shared/components/map/map.component';
import {City} from '../../models/city.model';
import {CityService} from '../../services/city/city.service';

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.css']
})
export class NewReviewComponent implements OnInit, OnDestroy {
  @ViewChild(ImageUploadComponent, {static: false}) imageUpload: ImageUploadComponent;
  @ViewChild(MapComponent, {static: false}) map: MapComponent;
  editorForm: FormGroup;
  titleExists = false;
  subscription: Subscription = null;
  articleLength: number;
  restaurant: Restaurant;
  coordinates = null;
  getAllCitiesSubscription: Subscription;
  cities: City[];
  cityIndex: number;

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
              private dialog: MatDialog,
              private restaurantService: RestaurantService,
              private snackBar: MatSnackBar,
              private cityService: CityService) {
  }

  ngOnInit() {
    this.editorForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[\\w\\,\\.\\-\\!\\?\\d\\s]+$'), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(3000)]]
    });
    this.getAllCities();
  }

  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    this.getAllCitiesSubscription.unsubscribe();
  }

  onSubmit() {
    this.saveRestaurant();
  }

  saveRestaurant() {
    this.restaurant.id ? this.addReview(this.restaurant) :
      this.restaurantService.addRestaurant(this.restaurant).subscribe(
        (restaurant: Restaurant) => {
          this.addReview(restaurant);
        },
        (error) => {
          this.snackBar.open('Zapisanie restauracji się nie powiodło, spróbuj za chwile', '', {
            duration: 3000
          });
        }
      );
  }

  addReview(restaurant: Restaurant) {
    const article = this.editorForm.value;
    article.content = JSON.parse(this.editorForm.value.content);
    article.restaurant_id = restaurant.id;
    this.subscription = this.articleService.newReview(article).subscribe(
      (id) => {
        this.titleExists = false;
        this.imageUpload.uploadImages(id.id);
      },
      error => {
        if (error.error.title !== undefined) {
          this.titleExists = true;
          this.snackBar.open(`Taki tytuł już istnieje`, '', {
            duration: 3000
          });
        } else {
          this.snackBar.open(`Zapisanie recenzji się nie powiodło`, '', {
            duration: 3000
          });
        }
      });
  }

  textChanged($event: { content: any; delta: any; editor: any; html: string | null; oldDelta: any; source: string; text: string }) {
    this.articleLength = $event.editor.getLength() - 1;
  }

  openAddRestaurantDialog() {
    const addRestaurantDialogRef = this.dialog.open(AddRestaurantComponent, {
      minHeight: '30vh',
      minWidth: '40wh'
    });

    addRestaurantDialogRef.afterClosed().subscribe(
      (restaurant: Restaurant) => {
        if (restaurant) {
          this.restaurant = restaurant;
          this.map.setLocation(restaurant.lat, restaurant.lon);
          this.cityIndex = this.cities.map(value => value.id).indexOf(restaurant.city);
        }
      }
    );
  }

  getAllCities() {
    this.getAllCitiesSubscription = this.cityService.getAllCities().subscribe(
      (cities: City[]) => {
        this.cities = cities;
      },
      (error) => {
        this.snackBar.open('Pobranie miast się nie powiodło, spróbuj ponownie otworzyć to okno', '', {
          duration: 3000
        });
      }
    );
  }
}
