import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubCategory } from 'src/app/models/sub-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}sub-categories`;

  constructor(private http: HttpClient) { }

  add(category: SubCategory) {
    return this.http.post<SubCategory>(this.ROOT_URL, category);
  }

  update(category: SubCategory) {
    return this.http.patch<SubCategory>(this.ROOT_URL + '/' + category.id, category);
  }

  list() {
    return this.http.get<SubCategory[]>(this.ROOT_URL);
  }

  listSubcategoriesByCategory(categoryId: number) {
    return this.http.get<SubCategory[]>(this.ROOT_URL + '/' + categoryId + '/sub-categories');
  }

  findById(id) {
    return this.http.get<SubCategory>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<SubCategory>(this.ROOT_URL + '/' + id);
  }
}
