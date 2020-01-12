import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {City} from '../../models/city.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) {
  }

  getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(`${environment.apiUrl}${environment.restaurantsUrl}${environment.citiesUrl}`)
      .pipe(
        catchError(err => throwError(err))
      );
  }

  addCity(city: City): Observable<City> {
    return this.http.post<City>(`${environment.apiUrl}${environment.restaurantsUrl}${environment.citiesUrl}`, city)
      .pipe(
        catchError(err => throwError(err))
      );
  }

  deleteCity(cityId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}${environment.restaurantsUrl}${environment.citiesUrl}${cityId}/`)
      .pipe(
        catchError(err => throwError(err))
      );
  }
}
