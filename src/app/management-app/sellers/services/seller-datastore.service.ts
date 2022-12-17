import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Seller } from 'src/app/models/seller';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}sellers`;

  constructor(private http: HttpClient) { }

  add(seller: Seller) {
    return this.http.post<Seller>(this.ROOT_URL, seller);
  }

  update(seller: Seller) {
    return this.http.patch<Seller>(this.ROOT_URL + '/' + seller.id, seller);
  }

  list(value) {
    return this.http.get<Seller[]>(this.ROOT_URL + '?search=' + value);
  }

  findById(id) {
    return this.http.get<Seller>(this.ROOT_URL + '/' + id);
  }
}
