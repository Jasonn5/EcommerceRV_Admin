import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}products`;

  constructor(private http: HttpClient) { }

  add(product: Product) {
    return this.http.post<Product>(this.ROOT_URL, product);
  }

  update(product: Product) {
    return this.http.patch<Product>(this.ROOT_URL + '/' + product.id, product);
  }

  list(value) {
    return this.http.get<Product[]>(this.ROOT_URL + '?search=' + value);
  }

  findById(id) {
    return this.http.get<Product>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<Product>(this.ROOT_URL + '/' + id);
  }
}
