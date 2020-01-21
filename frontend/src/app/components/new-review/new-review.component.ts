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
import {MapComponent} from '../map/map.component';

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
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.editorForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern('^[\\w\\,\\.\\-\\!\\?\\d\\s]+$'), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(3000)]]
    });
  }

  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    this.saveRestaurant();
  }

  saveRestaurant() {
    this.restaurantService.addRestaurant(this.restaurant).subscribe(
      (restaurant: Restaurant) => {
        this.addReview();
      },
      (error) => {
        this.snackBar.open('Zapisanie restauracji się nie powiodło, spróbuj za chwile', '', {
          duration: 3000
        });
      }
    );
  }

  addReview() {
    const article = this.editorForm.value;
    article.content = JSON.parse(this.editorForm.value.content);
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
          console.log(restaurant);
          this.restaurant = restaurant;
          this.map.setLocation(restaurant.lat, restaurant.lon);
        }
      }
    );
  }
}
