import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {AuthService} from './services/auth-service';
import {switchMap, take, catchError, filter} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  private static addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const skipUrls = [environment.loginUrl, environment.refreshUrl];
    const requestUrl = request.url.replace(environment.apiUrl, '');


    if (this.authService.getTokens()) {
      request = TokenInterceptor.addToken(request, this.authService.getTokens());
    }

    return next.handle(request)
      .pipe(
        catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !skipUrls.includes(requestUrl)) {
        return this.handle401Error(request, next);
      } else {
        return throwError(error);
      }
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshTokens().pipe(

        switchMap((token: any) => {
          this.isRefreshing = false;

          if (token === '401 error') {
            return next.handle(request);
          } else {
            this.refreshTokenSubject.next(token.access);
            return next.handle(TokenInterceptor.addToken(request, token.access));
          }



        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(TokenInterceptor.addToken(request, jwt));
        }));
    }
  }


}
