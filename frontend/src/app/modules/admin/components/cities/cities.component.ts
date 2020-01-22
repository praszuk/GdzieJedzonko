import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {User} from '../../../../models/user.model';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatRipple} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {City} from '../../../../models/city.model';
import {CityService} from '../../../../services/city/city.service';
import {MatDialog} from '@angular/material/dialog';
import {AddCityComponent} from './add-city/add-city.component';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit, OnDestroy {
  cityDataSource: MatTableDataSource<City>;
  selectedRowIndex: number;
  getAllCitiesSubscription: Subscription;
  deleteCitySubscription: Subscription;
  addCitySubscription: Subscription;

  displayedColumns = ['id', 'name', 'lat', 'lon'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatRipple, {static: true}) ripple: MatRipple;


  constructor(private snackBar: MatSnackBar,
              private cityService: CityService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.cityDataSource = new MatTableDataSource<City>();
    this.getAllCities();
  }

  ngOnDestroy(): void {
    this.getAllCitiesSubscription.unsubscribe();
    if (this.deleteCitySubscription) {
      this.deleteCitySubscription.unsubscribe();
    }
    if (this.addCitySubscription) {
      this.addCitySubscription.unsubscribe();
    }
  }

  getAllCities() {
    this.getAllCitiesSubscription = this.cityService.getAllCities().subscribe(
      (cities: City[]) => {
        this.cityDataSource.data = cities;
      },
      (error) => {
        this.snackBar.open('Pobranie miast nie powiodło się, spróbuj ponownie później', '', {
          duration: 3000
        });
      }
    );
  }

  deleteCity(cityId: number) {
    this.deleteCitySubscription = this.cityService.deleteCity(cityId).subscribe(
      () => {
        const index = this.cityDataSource.data.map(value => value.id).indexOf(cityId);
        this.cityDataSource.data.splice(index, 1);
        this.cityDataSource.data = this.cityDataSource.data;
      },
      (error) => {
        this.snackBar.open('Usunięcie miasta nie powiodło się, spróbuj ponownie później', '', {
          duration: 3000
        });
      }
    );
  }

  addCity(city: City) {
    this.addCitySubscription = this.cityService.addCity(city).subscribe(
      (response: City) => {
        this.cityDataSource.data.push(response);
        this.cityDataSource.data = this.cityDataSource.data;
      },
      (error) => {
        this.snackBar.open('Dodanie miasta nie powiodło się, spróbuj ponownie później', '', {
          duration: 3000
        });
      }
    );
  }

  openAddCityDialog() {
    const addCityDialogRef = this.dialog.open(AddCityComponent, {});

    addCityDialogRef.afterClosed().subscribe(
      (city: City) => {
        if (city) {
          this.addCity(city);
        }
      }
    )
  }


  applyFilter(filter: string) {
    this.cityDataSource.filter = filter.trim().toLowerCase();
  }

  selectRow(row: User) {
    this.selectedRowIndex = row.id;
  }
}
