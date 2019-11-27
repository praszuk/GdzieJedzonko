import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Article} from '../../models/article.model';
import {Observable, of, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, mapTo} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {}

  newReview(article: {title: string, content: string}): Observable<string> {
    return this.http.post(`${environment.apiUrl}${environment.newArticleUrl}`, article)
      .pipe(
        mapTo('success'),
        catchError((err) => {
          return throwError(err.title);
        })
      );
  }

  getAllArticles(): Observable<>
}
