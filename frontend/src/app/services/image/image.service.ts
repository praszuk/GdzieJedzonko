import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {
  }

  uploadThumbnail(articleId: number, image: File) {
    console.log('inside imageservice');
    const formData = new FormData();
    formData.append('thumbnail', image);
    return this.http.post(`${environment.apiUrl}${environment.articlesUrl}${articleId}${environment.imagesUrl}`, formData, {
      headers: new HttpHeaders().set('Content-type', 'multipart/form-data'),
    })
      .pipe(
        catchError(
          (err) => throwError(err)
        )
      );
  }

  uploadImage(articleId: number, image: File) {
    console.log('inside imageservice');
    const formData = new FormData();
    formData.append('photo', image);
    return this.http.post(`${environment.apiUrl}${environment.articlesUrl}${articleId}${environment.imagesUrl}`, formData , {
      headers: new HttpHeaders().set('Content-type', 'multipart/form-data'),
    })
      .pipe(
        catchError(
          (err) => throwError(err)
        )
      );
  }
}
