import {Component, OnInit, ViewChild} from '@angular/core';
import {City} from '../../models/city.model';
import {Restaurant} from '../../models/restaurant.model';
import {MapComponent} from '../../modules/shared/components/map/map.component';
import {Subscription} from 'rxjs';
import {CityService} from '../../services/city/city.service';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpParams} from '@angular/common/http';
import {ArticleService} from '../../services/article/article.service';
import {Post} from '../../models/post.model';
import {PostsSectionComponent} from '../posts-section/posts-section.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild(MapComponent, {static: false}) map: MapComponent;
  @ViewChild(PostsSectionComponent, {static: true}) postsSection: PostsSectionComponent;
  searchBarForm: FormGroup;
  cities: City[];
  getAllCitiesSubscription: Subscription;
  restaurants: Restaurant[];
  getAllRestaurantsSubscription: Subscription;
  searchBarOptions = ['Tytuł recenzji', 'Imie', 'Nazwisko', 'Imie i nazwisko'];
  selectedSearchOption: string;
  showCurrentReviews = false;



  constructor(private cityService: CityService,
              private restaurantService: RestaurantService,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private articleService: ArticleService) {
  }

  ngOnInit() {
    this.searchBarForm = this.formBuilder.group({
      content: ['', Validators.required]
    });
    this.getAllCities();
    this.selectedSearchOption = this.searchBarOptions[0];
  }


  getAllCities() {
    this.getAllCitiesSubscription = this.cityService.getAllCities().subscribe(
      (cities: City[]) => {
        this.cities = cities;
        this.map.goToLocation(this.cities[0].lat, this.cities[0].lon);
        this.getAllRestaurantsByCity(this.cities[0]);
      },
      (error) => {
        this.snackBar.open('Pobranie miast się nie powiodło, spróbuj ponownie otworzyć to okno', '', {
          duration: 3000
        });
      }
    );
  }

  getAllRestaurantsByCity(city: City) {
    this.getAllRestaurantsSubscription = this.restaurantService.getAllRestaurants(city.id).subscribe(
      (restaurants: Restaurant[]) => {
        this.restaurants = restaurants;
        this.map.goToLocation(city.lat, city.lon);
        this.map.setRestaurantMarkers(restaurants);
      },
      (error) => {
        this.snackBar.open('Pobranie restauracji się nie powiodło, spróbuj ponownie otworzyć to okno', '', {
          duration: 3000
        });
      }
    );
  }

  onSubmit() {
    this.showCurrentReviews = true;
    const searchValue: string = this.searchBarForm.value.content;
    this.searchBarForm.get('content').setValue('');
    switch (this.selectedSearchOption) {
      case 'Tytuł recenzji':
        const title = new HttpParams().set('title', searchValue);
        this.searchForArticles(title);
        break;
      case 'Imie':
        const firstName = new HttpParams().set('first_name', searchValue);
        this.searchForArticles(firstName);
        break;
      case 'Nazwisko':
        const lastName = new HttpParams().set('last_name', searchValue);
        this.searchForArticles(lastName);
        break;
      case 'Imie i nazwisko':
        const both = searchValue.split(' ');
        const name = new HttpParams().set('first_name', both[0]).set('last_name', both[1]);
        this.searchForArticles(name);
        break;

    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

  searchForArticles(params: HttpParams) {
    this.articleService.searchForArticles(params).subscribe(
      (posts: Post[]) => {
        this.postsSection.posts = posts;
      },
      (error) => {
        this.snackBar.open('Wyszukiwanie nie powiodło się, spróbuj ponownie pozniej', '', {
          duration: 3000
        });
      }
    );
  }

  fetchCurrentReviews() {
    this.postsSection.posts = [];
    this.postsSection.getAllArticles();
  }
}
