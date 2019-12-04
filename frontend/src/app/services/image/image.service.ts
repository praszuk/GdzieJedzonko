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

  uploadImage(articleId: number, file: File) {
    console.log('inside imageservice');
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/${articleId}${environment.imagesUrl}`, formData)
      .pipe(
        catchError(
          (err) => throwError(err)
        )
      );
  }
}
