import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../models/user.model';
import {Tokens} from '../tokens.model';
import {Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import {catchError, mapTo, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UserService} from '../../services/user/user.service';
import {Role} from '../../models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN = 'access';
  private readonly REFRESH_TOKEN = 'refresh';

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
  }

  register(user) {
    return this.http.post<User>(`${environment.apiUrl}${environment.userUrl}`, user);
  }

  login(credentials: {email: string, password: string}): Observable<boolean> {
    return this.http.post<Tokens>(`${environment.apiUrl}${environment.loginUrl}`, credentials)
      .pipe(
        tap((tokens: Tokens) => this.storeTokens(tokens)),
        switchMap((tokens: Tokens) => this.getUserById(this.getUserIdFromTokens(tokens.access))
          .pipe(
            tap(user => {
              this.register({});
              this.setUser(user);
              this.setUserSubjectValue(user);
            })
          )),
        mapTo(true),
        catchError(error => {
          return of(false);
        }));

  }

  logout() {
    this.setUser(null);
    this.removeTokens();
    this.setUserSubjectValue(null);
    this.router.navigate(['home']);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  refreshTokens() {
    return this.http.post<any>(`${environment.apiUrl}${environment.refreshUrl}`, {
      refresh: this.getRefreshTokens()})
      .pipe(
        tap((tokens: Tokens) => {
        this.storeAccessTokens(tokens.access);
    }), catchError((err) => {
      if (err.status === 401) {
        this.logout();
        this.router.navigate(['/login']);
        return of('401 error');
      }
      }));
  }

  getUserSubject(): Observable<User> {
    return this.userService.getUserSubject();
  }

  getTokens() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getCurrentUserById(): Observable<User> {
    return this.getUserById(this.getUserIdFromTokens(this.getAccessToken()));
  }

  getUserById(id: number): Observable<User> {
    return this.userService.getUserById(id);
  }

  getUserIdFromTokens(token: string): number {
    return JSON.parse(atob(token.split('.')[1])).user_id;
  }

  getRoleFromTokens(): number {
    if (this.isLoggedIn()) {
      const token = this.getAccessToken();
      return JSON.parse(atob(token.split('.')[1])).role;
    } else {
      return Role.GUEST;
    }
  }



  private getRefreshTokens() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  private storeAccessTokens(accessTokens: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessTokens);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.ACCESS_TOKEN, tokens.access);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh);
  }

  private removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  setUser(user: User) {
    this.userService.setUser(user);
  }

  private setUserSubjectValue(value) {
    this.userService.setUserSubjectValue(value);
  }
}
