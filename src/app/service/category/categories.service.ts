import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get('https://localhost:7167/ProductCategories/Index');
  }

  getCategory(id:number){
    return this.http.get('https://localhost:7167/ProductCategories/Details/' + id)
  }

  getCategoryWithOutProducts() {
    return this.http.get('https://localhost:7167/ProductCategories/IndexWhithOutProducts');
  }
}
