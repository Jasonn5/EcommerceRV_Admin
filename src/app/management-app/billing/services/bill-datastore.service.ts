import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from 'src/app/models/bill';
import { BillDetail } from 'src/app/models/bill-detail';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}bills`;

  constructor(private http: HttpClient) { }

  add(bill: Bill) {
    return this.http.post<Bill>(this.ROOT_URL, bill);
  }

  list(saleId) {
    return this.http.get<Bill[]>(this.ROOT_URL + '/listBySale/' + saleId);
  }

  findById(id) {
    return this.http.get<Bill>(this.ROOT_URL + '/' + id);
  }

  update(bill: Bill) {
    return this.http.patch<Bill>(this.ROOT_URL + '/' + bill.id, bill);
  }
}
