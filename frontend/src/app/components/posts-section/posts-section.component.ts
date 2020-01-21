import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Post} from '../../models/post.model';
import {ArticleService} from '../../services/article/article.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CityService} from '../../services/city/city.service';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {City} from '../../models/city.model';
import {Restaurant} from '../../models/restaurant.model';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'app-posts-section',
  templateUrl: './posts-section.component.html',
  styleUrls: ['./posts-section.component.css']
})
export class PostsSectionComponent implements OnInit {
  @Input() userId?: number;
  @ViewChild(MapComponent, {static: false}) map: MapComponent;

  posts: Post[] = [];
  isError = false;
  isLoading = true;
  cities: City[];
  getAllCitiesSubscription: Subscription;
  restaurants: Restaurant[];
  getAllRestaurantsSubscription: Subscription;

  constructor(private articleService: ArticleService,
              private loadingService: NgxSpinnerService,
              private cityService: CityService,
              private restaurantService: RestaurantService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    // this.loadingService.show('posts-section-loading');
    if (this.userId) {
      this.getUserArticles(this.userId);
    } else {
      this.getAllArticles();
    }

    this.getAllCities();
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
        // this.loadingService.hide('posts-section-loading');
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
        // this.loadingService.hide('posts-section-loading');
      },
      (error) => {
        this.isError = true;
      }
    );
  }

  getAllCities() {
    this.getAllCitiesSubscription = this.cityService.getAllCities().subscribe(
      (cities: City[]) => {
        this.cities = cities;
        this.map.goToLocation(this.cities[0].lat, this.cities[0].lon);
        this.getAllRestaurantsByCity(this.cities[0]);
      },
      (error) => {
        this.isLoading = false;
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
        this.isLoading = false;
        this.snackBar.open('Pobranie restauracji się nie powiodło, spróbuj ponownie otworzyć to okno', '', {
          duration: 3000
        });
      }
    );
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }
}
