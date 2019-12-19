import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, mapTo} from 'rxjs/operators';
import {Post} from '../../models/post.model';
import {Article} from '../../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {}

  newReview(article: {title: string, content: string}): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.articlesUrl}`, article)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getAllArticles(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}${environment.articlesUrl}`)
      .pipe(
        catchError(
          err => throwError(err)
        )
      );
  }

  getUserArticles(userId: number): Observable<Post[]> {
    const params = new HttpParams()
      .set('user', String(userId));
    return this.http.get<Post[]>(`${environment.apiUrl}${environment.articlesUrl}`, {params})
      .pipe(
        catchError(
          err => throwError(err)
        )
      );
  }

  getArticle(articleId: number): Observable<Article> {
    return this.http.get<Article>(`${environment.apiUrl}${environment.articlesUrl}${articleId}`)
      .pipe(
        catchError(
          err => throwError(err)
        )
      );
  }

  deleteArticle(articleId: number): Observable<boolean> {
    return this.http.delete<Article>(`${environment.apiUrl}${environment.articlesUrl}${articleId}`)
      .pipe(
        mapTo(true),
        catchError(
          err => throwError(err)
        )
      );
  }

  updateArticle(articleId: number, article: {title?: string; content?: string}) {
    return this.http.patch(`${environment.apiUrl}${environment.articlesUrl}${articleId}`, article)
      .pipe(
        mapTo(true),
        catchError(
          err => throwError(err)
        )
      );
  }

}
