import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RestaurantService} from '../../../services/restaurant/restaurant.service';
import {Restaurant} from '../../../models/restaurant.model';
import {CityService} from '../../../services/city/city.service';
import {City} from '../../../models/city.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css']
})
export class AddRestaurantComponent implements OnInit, OnDestroy {
  restaurantForm: FormGroup;
  cities: City[];
  restaurants: Restaurant[];
  addressError: boolean;
  isLoading = true;
  areCitiesFetched = false;
  areRestaurantsFetched: boolean;
  newRestaurant = false;
  getAllRestaurantsSubscription: Subscription;
  getAllCitiesSubscription: Subscription;
  checkRestaurantSubscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private addRestaurantRef: MatDialogRef<AddRestaurantComponent>,
              private formBuilder: FormBuilder,
              private restaurantService: RestaurantService,
              private cityService: CityService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.restaurantForm = this.formBuilder.group({
      name: ['', Validators.required],
      lat: [''],
      lon: [''],
      city: ['', Validators.required],
      street: ['', Validators.required],
      building: ['', Validators.required],
      website: ['']
    });

    this.getAllCities();
  }

  ngOnDestroy(): void {
    if (this.checkRestaurantSubscription) {
      this.checkRestaurantSubscription.unsubscribe();
    }
    if (this.getAllCitiesSubscription) {
      this.getAllCitiesSubscription.unsubscribe();
    }
    if (this.getAllRestaurantsSubscription) {
      this.getAllRestaurantsSubscription.unsubscribe();
    }
  }

  close() {
    this.addRestaurantRef.close();
  }

  onSubmit() {
    this.addRestaurantRef.close(this.restaurantForm.value);
  }

  checkRestaurant() {
    this.isLoading = true;
    this.addressError = false;
    const address: string =
      this.restaurantForm.get('city').value + '' +
      this.restaurantForm.get('street').value + ' ' +
      this.restaurantForm.get('building').value;

    this.checkRestaurantSubscription = this.restaurantService.checkRestaurant(address).subscribe(
      (restaurant: Restaurant) => {
        this.restaurantForm.get('lat').setValue(restaurant.lat);
        this.restaurantForm.get('lon').setValue(restaurant.lon);
        this.onSubmit();
      },
      (error) => {
        this.addressError = true;
        this.isLoading = false;
      }
    );
  }

  getAllCities() {
    this.getAllCitiesSubscription = this.cityService.getAllCities().subscribe(
      (cities: City[]) => {
        this.cities = cities;
        this.areCitiesFetched = true;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.areCitiesFetched = false;
        this.snackBar.open('Pobranie miast się nie powiodło, spróbuj ponownie otworzyć to okno', '', {
          duration: 3000
        });
      }
    );
  }

  getAllRestaurantsByCityId(cityId: number) {
    this.restaurantForm.get('city').setValue(cityId);
    this.getAllRestaurantsSubscription = this.restaurantService.getAllRestaurants(cityId).subscribe(
      (restaurants: Restaurant[]) => {
        this.restaurants = restaurants;
        this.areRestaurantsFetched = true;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.areRestaurantsFetched = false;
        this.snackBar.open('Pobranie restauracji się nie powiodło, spróbuj ponownie otworzyć to okno', '', {
          duration: 3000
        });
      }
    );
  }

  selectedRestaurant(restaurant: Restaurant) {
    this.restaurantForm.get('name').setValue(restaurant.name);
    this.restaurantForm.get('lat').setValue(restaurant.lat);
    this.restaurantForm.get('lon').setValue(restaurant.lon);
    this.restaurantForm.get('street').setValue(restaurant.address);
    this.restaurantForm.get('building').setValue(restaurant.address);
    // todo change building
  }

  setRestaurant() {
    console.log(this.restaurantForm.value)
    this.onSubmit();
  }
}
