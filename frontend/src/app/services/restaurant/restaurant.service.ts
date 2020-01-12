import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Restaurant} from '../../models/restaurant.model';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) {
  }

  getAllRestaurants(cityId: number): Observable<Restaurant[]> {
    const params = new HttpParams().set('city', String(cityId))
    return this.http.get<Restaurant[]>(`${environment.apiUrl}${environment.restaurantsUrl}`, {params})
      .pipe(
        catchError(err => throwError(err))
      );
  }

  checkRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.http.get<Restaurant>(`CHECK RESTAURANT URL`)
      .pipe(
        catchError(err => throwError(err))
      );
  }

  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${environment.apiUrl}${environment.restaurantsUrl}`, restaurant)
      .pipe(
        catchError(err => throwError(err))
      );
  }

  deleteRestaurant(restaurantId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}${environment.restaurantsUrl}${restaurantId}/`)
      .pipe(
        catchError(err => throwError(err))
      );
  }
}
