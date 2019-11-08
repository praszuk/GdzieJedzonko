import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../user";
import {Tokens} from "../tokens.model";
import {Observable, of} from "rxjs";
import {config} from "../../config"
import {catchError, concatAll, flatMap, mapTo, mergeAll, switchMap, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN = "access";
  private readonly REFRESH_TOKEN = "refresh";
  private user: User;

  constructor(private http: HttpClient) {}


  login(credentials: {email: string, password: string}): Observable<boolean> {
    return this.http.post<Tokens>(`${config.apiUrl}/api/sessions/token/`, credentials)
      .pipe(
        tap((tokens: Tokens) => this.storeTokens(tokens)),
        switchMap((tokens: Tokens) => this.http.get<User>(`${config.apiUrl}/api/users/${this.getUserIdFromTokens(tokens.access)}/`)
          .pipe(
            tap(user => this.user = user)
          )),
        mapTo(true),
        catchError(error => {
          alert(JSON.stringify(error.error));
          return of(false);
        }));

  }

  logout() {

  }

  isLoggedIn() {

  }

  refreshTokens() {
    return this.http.post<any>(`${config.apiUrl}/api/sessions/refresh/`, {
      'refresh': this.getRefreshTokens()})
      .pipe(
        tap((tokens: Tokens) => {
        this.storeAccessTokens(tokens.access);
    }));
  }

  getTokens() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getUserIdFromTokens(token: string): number{
    return JSON.parse(atob(token.split('.')[1])).user_id
  }

  private setUser(user: User) {
    this.user = user;
  }

  private logoutUser() {
    this.user = null;
    this.removeTokens();
  }

  private getRefreshTokens() {
    return localStorage.getItem(this.REFRESH_TOKEN);
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

}
