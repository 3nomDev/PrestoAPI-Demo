import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PrestoService {
  projectBase = 'demo-backend.prestoapi.com';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(this.projectBase).toPromise();
  }
}
