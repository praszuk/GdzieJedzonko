import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Restaurant} from '../../../../models/restaurant.model';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatRipple} from '@angular/material/core';
import {RestaurantService} from '../../../../services/restaurant/restaurant.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {Location} from '@angular/common';
import {LocationMapDialogComponent} from './dialogs/location-map-dialog/location-map-dialog.component';
import {EditRestaurantDialogComponent} from './dialogs/edit-restaurant-dialog/edit-restaurant-dialog.component';

@Component({
  selector: 'app-pending-restaurants',
  templateUrl: './pending-restaurants.component.html',
  styleUrls: ['./pending-restaurants.component.css']
})
export class PendingRestaurantsComponent implements OnInit, OnDestroy {
  restaurantDataSource: MatTableDataSource<Restaurant>;
  subscription: Subscription;
  updateRestaurantSubscription: Subscription;
  deleteRestaurantSubscription: Subscription;
  selectedRowIndex: number;
  selectedRestaurant: Restaurant;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatRipple, {static: true}) ripple: MatRipple;

  displayedColumns = ['id', 'name', 'city', 'address', 'authorName'];

  constructor(private restaurantService: RestaurantService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private location: Location) {
  }

  ngOnInit() {
    this.restaurantDataSource = new MatTableDataSource();
    this.restaurantDataSource.sort = this.sort;
    this.restaurantDataSource.paginator = this.paginator;
    this.getAllPendingRestaurants();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.updateRestaurantSubscription) {
      this.updateRestaurantSubscription.unsubscribe();
    }
    if (this.deleteRestaurantSubscription) {
      this.deleteRestaurantSubscription.unsubscribe();
    }
  }

  getAllPendingRestaurants() {
    this.subscription = this.restaurantService.getAllPendingRestaurants().subscribe(
      (restaurants: Restaurant[]) => {
        if (!restaurants.length) {
          this.snackBar.open('Brak restauracji do akceptacji', '', {
            duration: 2000
          });
        }
        this.restaurantDataSource.data = restaurants;
      },
      (error) => {
        this.snackBar.open('Pobranie restauracji nie powiodło się, spróbuj ponownie', '', {
          duration: 2000
        });
      }
    );
  }

  updateRestaurant(restaurantId: number, restaurant: Restaurant) {
    this.updateRestaurantSubscription = this.restaurantService.updateRestaurant(restaurantId, restaurant).subscribe(
      (response: Restaurant) => {
        const index = this.restaurantDataSource.data.map(value => value.id).indexOf(restaurantId);
        if (response.is_approved) {
          this.restaurantDataSource.data.splice(index, 1);
        } else {
          this.restaurantDataSource.data[index] = response;
        }
        this.restaurantDataSource.data = this.restaurantDataSource.data;
      },
      (error) => {
        this.snackBar.open('Aktualizacja restauracji nie powiodła się, spróbuj ponownie', '', {
          duration: 2000
        });
      }
    );
  }

  deleteRestaurant(restaurantId: number) {
    this.deleteRestaurantSubscription = this.restaurantService.deleteRestaurant(restaurantId).subscribe(
      (response) => {
        const index = this.restaurantDataSource.data.map(value => value.id).indexOf(restaurantId);
        this.restaurantDataSource.data.splice(index, 1);
        this.restaurantDataSource.data = this.restaurantDataSource.data;
        this.snackBar.open('Pomyślnie usunięto', '', {
          duration: 1000
        });
      },
      (error) => {
        this.snackBar.open('Usunięcie restauracji nie powiodło się, spróbuj ponownie', '', {
          duration: 2000
        });
      }
    );
  }


  applyFilter(filter: string) {
    this.restaurantDataSource.filter = filter.trim().toLowerCase();
  }

  selectRow(row: Restaurant) {
    this.selectedRowIndex = row.id;
    this.selectedRestaurant = row;
  }

  openLocationMap() {
    const data = {
      coordinates: {
        lat: this.selectedRestaurant.lat,
        lon: this.selectedRestaurant.lon
      }
    };
    const locationMapRef = this.dialog.open(LocationMapDialogComponent, {
      minWidth: '50vw',
      data
    });
  }


  acceptRestaurant() {
    const restaurant: Restaurant = new Restaurant();
    restaurant.is_approved = true;
    console.log(restaurant);
    this.updateRestaurant(this.selectedRowIndex, restaurant);
  }

  rejectRestaurant() {
    this.deleteRestaurant(this.selectedRowIndex);
  }

  editRestaurant() {
    const data = {
      restaurant: this.selectedRestaurant
    };
    const editRestaurantRef = this.dialog.open(EditRestaurantDialogComponent, {
      data,
      minWidth: '45vw'
    });

    editRestaurantRef.afterClosed().subscribe(
      (response: Restaurant) => {
        this.updateRestaurant(this.selectedRowIndex, response);
      }
    );

  }

  previousPage() {
    this.location.back();
  }

}
