import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {User} from '../../models/user.model';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  constructor(private http: HttpClient) {
  }


  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/users/${id}/`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}${environment.userUrl}`)
      .pipe(
        catchError(
          err => throwError(err)
        )
      );
  }

  editUser(id: number, user: {
                        email?: string;
                        password?: string;
                        role?: number;
                        first_name?: string;
                        last_name?: string;
                        birth_date?: string; }): Observable<any> {

    return this.http.patch<any>(`${environment.apiUrl}${environment.userUrl}${id}/`, user)
      .pipe(
        catchError(
          err => throwError(err)
        )
      );
  }

  editProfile(user: {
                            email?: string;
                            password?: string;
                            first_name?: string;
                            last_name?: string;
                            birth_date?: string; }): Observable<any> {

    const id = this.getCurrentUserId();
    return this.http.patch<any>(`${environment.apiUrl}${environment.userUrl}${id}/`, user)
      .pipe(
        catchError(
          err => throwError(err)
        )
      );
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}${environment.userUrl}${id}/`)
      .pipe(
        catchError(
          err => throwError(err)
        )
      );
  }

  getCurrentUserById(): Observable<User> {
    return this.getUserById(this.getUserIdFromTokens(this.getAccessToken()));
  }

  getCurrentUserId() {
    return this.getUserIdFromTokens(this.getAccessToken());
  }

  getUserIdFromTokens(token: string): number {
    return JSON.parse(atob(token.split('.')[1])).user_id;
  }

  getAccessToken() {
    return localStorage.getItem('access');
  }

  getUser() {
    return this.user;
  }

  getUserFullName() {
    return `${this.user.first_name} ${this.user.last_name}`;
  }

  getUserRole() {
    return this.user.role;
  }

  setUser(user: User) {
    this.user = user;
  }



}
