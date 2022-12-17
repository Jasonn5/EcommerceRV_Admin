import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sale } from 'src/app/models/sale';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}sales`;

  constructor(private http: HttpClient) { }

  add(sale: Sale) {
    return this.http.post<Sale>(this.ROOT_URL, sale);
  }

  update(sale: Sale) {
    return this.http.patch<Sale>(this.ROOT_URL + '/' + sale.id, sale);
  }

  cancelSale(sale: Sale) {
    return this.http.patch<Sale>(this.ROOT_URL + '/cancelSale/sales/' + sale.id, sale);
  }

  list(value, startDate, endDate) {
    return this.http.get<Sale[]>(this.ROOT_URL + '?search=' + value + '&&startDate=' + startDate + '&&endDate=' + endDate);
  }

  findById(id) {
    return this.http.get<Sale>(this.ROOT_URL + '/' + id);
  }

  getCode(date) {
    return this.http.get<Sale>(this.ROOT_URL + '/getSaleCode/' + date);
  }
}
