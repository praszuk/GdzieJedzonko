import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  uploadImage(articleId: number, image: File) {
    console.log('inside imageservice');
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(`${environment.apiUrl}${environment.articlesUrl}${articleId}${environment.imagesUrl}`, formData)
      .pipe(
        catchError(
          (err) => throwError(err)
        )
      );
  }
}
