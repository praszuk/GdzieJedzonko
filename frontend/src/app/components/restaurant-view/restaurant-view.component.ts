import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Restaurant} from '../../models/restaurant.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-restaurant-view',
  templateUrl: './restaurant-view.component.html',
  styleUrls: ['./restaurant-view.component.css']
})
export class RestaurantViewComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  restaurantSubscription: Subscription;
  restaurantId: number;
  restaurant: Restaurant;
  coordinates: any;

  constructor(private restaurantService: RestaurantService,
              private Activatedroute: ActivatedRoute,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.subscription = this.Activatedroute.paramMap.subscribe(params => {
        this.restaurantId = +params.get('id');
      }
    );
    this.getRestaurant(this.restaurantId);
  }

  getRestaurant(restaurantId: number) {
    this.restaurantSubscription = this.restaurantService.getRestaurant(restaurantId).subscribe(
      (response: Restaurant) => {
        this.coordinates = {lat: response.lat, lon: response.lon};
        this.restaurant = response;
      },
      (error) => {
        this.snackBar.open('Pobranie restauracji się nie powiodło, spróbuj ponownie później', '', {
          duration: 3000
        });
      }
    )
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.restaurantSubscription) {
      this.restaurantSubscription.unsubscribe();
    }
  }
}
