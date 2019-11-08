import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../user";
import {Token} from "../token.model";
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
    return this.http.post<Token>(`${config.apiUrl}/api/sessions/token/`, credentials)
      .pipe(
        tap((tokens: Token) => this.storeTokens(tokens)),
        switchMap((tokens: Token) => this.http.get<User>(`${config.apiUrl}/api/users/${this.getUserIdFromToken(tokens.access)}/`)
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

  refreshToken() {
    return this.http.post<any>(`${config.apiUrl}/api/sessions/refresh/`, {
      'refresh': this.getRefreshToken()})
      .pipe(
        tap((tokens: Token) => {
        this.storeAccessToken(tokens.access);
    }));
  }

  getToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getUserIdFromToken(token: string): number{
    return JSON.parse(atob(token.split('.')[1])).user_id
  }

  private setUser(user: User) {
    this.user = user;
  }

  private logoutUser() {
    this.user = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeAccessToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  private storeTokens(token: Token) {
    localStorage.setItem(this.ACCESS_TOKEN, token.access);
    localStorage.setItem(this.REFRESH_TOKEN, token.refresh);
  }

  private removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

}
