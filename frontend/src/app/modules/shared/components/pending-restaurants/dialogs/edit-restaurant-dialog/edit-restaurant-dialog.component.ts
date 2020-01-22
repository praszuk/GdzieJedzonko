import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Restaurant} from '../../../../../../models/restaurant.model';
import {City} from '../../../../../../models/city.model';
import {Subscription} from 'rxjs';
import {CityService} from '../../../../../../services/city/city.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-restaurant-dialog',
  templateUrl: './edit-restaurant-dialog.component.html',
  styleUrls: ['./edit-restaurant-dialog.component.css']
})
export class EditRestaurantDialogComponent implements OnInit, OnDestroy {
  editRestaurantForm: FormGroup;
  restaurant: Restaurant;
  getAllCitiesSubscription: Subscription;
  cities: City[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private editRestaurantRef: MatDialogRef<EditRestaurantDialogComponent>,
              private cityService: CityService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getAllCities()
    this.restaurant = this.data.restaurant;
    this.editRestaurantForm = this.formBuilder.group({
      name: [this.restaurant.name, Validators.required],
      lat: [this.restaurant.lat],
      lon: [this.restaurant.lon],
      city: [this.restaurant.city, Validators.required],
      address: [this.restaurant.address, Validators.required],
      website: [this.restaurant.website]
    });
  }

  ngOnDestroy(): void {
    this.getAllCitiesSubscription.unsubscribe();
  }

  close() {
    this.editRestaurantRef.close(null);
  }

  onSubmit() {
    this.editRestaurantRef.close(this.editRestaurantForm.value);
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
