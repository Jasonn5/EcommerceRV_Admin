import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}categories`;

  constructor(private http: HttpClient) { }

  add(category: Category) {
    return this.http.post<Category>(this.ROOT_URL, category);
  }

  update(category: Category) {
    return this.http.patch<Category>(this.ROOT_URL + '/' + category.id, category);
  }

  list() {
    return this.http.get<Category[]>(this.ROOT_URL);
  }

  findById(id) {
    return this.http.get<Category>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<Category>(this.ROOT_URL + '/' + id);
  }
}
