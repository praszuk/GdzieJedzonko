import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Comment} from '../../models/comment.model';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Article} from "../../models/article.model";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  createComment(articleId: number, comment: {user: number, comment: string}): Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiUrl}${environment.articlesUrl}${articleId}${environment.commentsUrl}`,
      comment)
      .pipe(
        map((response: Comment) => {
          response.content = JSON.stringify(response.content);
          return response;
        }),
        catchError(
          (err) => throwError(err)
        )
      );
  }

  getAllComments(articleId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}${environment.articlesUrl}${articleId}${environment.commentsUrl}`)
      .pipe(
        map((response: Comment[]) => {
          response.forEach(value => {
            value.content = JSON.stringify(value.content);
            return response;
          });
          return response;
        }),
        catchError(
          (err) => throwError(err)
        )
      );
  }
}
