import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UploadimagesService {

  private apiUrl = 'http://localhost:3000/upload';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
      const formData = new FormData();
      formData.append('productImage', file);
      return this.http.post(this.apiUrl, formData);
  }
}
