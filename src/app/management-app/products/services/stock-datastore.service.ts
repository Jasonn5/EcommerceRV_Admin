import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stock } from 'src/app/models/stock';
import { TransferStock } from 'src/app/models/transfer-stock';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}stocks`;

  constructor(private http: HttpClient) { }

  add(stock: Stock) {
    return this.http.post<Stock>(this.ROOT_URL, stock);
  }

  update(stock: Stock) {
    return this.http.patch<Stock>(this.ROOT_URL + '/' + stock.id, stock);
  }

  list(value) {
    return this.http.get<Stock[]>(this.ROOT_URL + '?search=' + value);
  }

  listStockByLocation(value, locationId) {
    return this.http.get<Stock[]>(`${environment.BACK_END_HOST}locations/${locationId}/stocks` + '?search=' + value);
  }

  findById(id) {
    return this.http.get<Stock>(this.ROOT_URL + '/' + id);
  }

  transferStock(transferStock: TransferStock){
    return this.http.post<TransferStock>(`${environment.BACK_END_HOST}transfer-stock`, transferStock);
  }
}
