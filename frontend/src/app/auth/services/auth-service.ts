import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../user";
import {Tokens} from "../tokens.model";
import {BehaviorSubject, Observable, of} from "rxjs";
import {config} from "../../config"
import {catchError, mapTo, switchMap, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN = "access";
  private readonly REFRESH_TOKEN = "refresh";
  private userSubject: BehaviorSubject<User>;
  user: User;
  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(null);
  }


  login(credentials: {email: string, password: string}): Observable<boolean> {
    return this.http.post<Tokens>(`${config.apiUrl}/api/sessions/token/`, credentials)
      .pipe(
        tap((tokens: Tokens) => this.storeTokens(tokens)),
        switchMap((tokens: Tokens) => this.getUserById(this.getUserIdFromTokens(tokens.access))
          .pipe(
            tap(user => {
              this.setUser(user);
              this.userSubject.next(user);})
          )),
        mapTo(true),
        catchError(error => {
          return of(false);
        }));

  }

  logout() {
    console.log("Logged out");
    this.setUser(null);
    this.removeTokens();
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  refreshTokens() {
    return this.http.post<any>(`${config.apiUrl}/api/sessions/refresh/`, {
      'refresh': this.getRefreshTokens()})
      .pipe(
        tap((tokens: Tokens) => {
        this.storeAccessTokens(tokens.access);
    }));
  }

  getUserSubject(): Observable<User>{
    return this.userSubject.asObservable();
  }

  getTokens() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getCurrentUserById(): Observable<User>{
    return this.http.get<User>(`${config.apiUrl}/api/users/${this.getUserIdFromTokens(this.getAccessToken())}/`);
  }

  getUserById(id: number): Observable<User>{
    return this.http.get<User>(`${config.apiUrl}/api/users/${id}/`);
  }

  getUserIdFromTokens(token: string): number{
    return JSON.parse(atob(token.split('.')[1])).user_id
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

  getUser() {
    return this.user;
  }

  getUserFullName(){
    return `${this.user.first_name} ${this.user.last_name}`;
  }

  getUserRole(){
    return this.user.role;
  }

  setUser(user: User) {
    this.user = user;
  }

}
