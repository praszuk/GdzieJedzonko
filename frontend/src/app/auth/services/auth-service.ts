import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {User} from "../../user";
import {Tokens} from "../tokens.model";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {environment} from "src/environments/environment";
import {catchError, mapTo, switchMap, tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN = "access";
  private readonly REFRESH_TOKEN = "refresh";
  private userSubject: BehaviorSubject<User>;
  user: User;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<User>(null);
  }

  register(user) {
    return this.http.post<User>(`${environment.apiUrl}${environment.registerUrl}`, user);
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
              this.userSubject.next(user);
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
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  refreshTokens() {
    return this.http.post<any>(`${environment.apiUrl}${environment.refreshUrl}`, {
      'refresh': this.getRefreshTokens()})
      .pipe(
        tap((tokens: Tokens) => {
        this.storeAccessTokens(tokens.access);
    }),catchError((err) => {
      if(err.status == 401) {
        this.logout();
        this.router.navigate(['/login']);
        return of('401 error')
      }
      }));
  }

  getUserSubject(): Observable<User>{
    return this.userSubject.asObservable();
  }

  getTokens() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getCurrentUserById(): Observable<User>{
    return this.http.get<User>(`${environment.apiUrl}/api/users/${this.getUserIdFromTokens(this.getAccessToken())}/`);
  }

  getUserById(id: number): Observable<User>{
    return this.http.get<User>(`${environment.apiUrl}/api/users/${id}/`);
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
