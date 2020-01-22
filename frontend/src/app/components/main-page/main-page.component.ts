import {Component, OnInit, ViewChild} from '@angular/core';
import {City} from '../../models/city.model';
import {Restaurant} from '../../models/restaurant.model';
import {MapComponent} from '../../modules/shared/components/map/map.component';
import {Subscription} from 'rxjs';
import {CityService} from '../../services/city/city.service';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild(MapComponent, {static: false}) map: MapComponent;
  cities: City[];
  getAllCitiesSubscription: Subscription;
  restaurants: Restaurant[];
  getAllRestaurantsSubscription: Subscription;

  constructor(private cityService: CityService,
              private restaurantService: RestaurantService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getAllCities();
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

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

}
