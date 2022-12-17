import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProviderBill } from 'src/app/models/provider-bill';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderBillDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}provider-bills`;

  constructor(private http: HttpClient) { }

  add(providerBill: ProviderBill) {
    return this.http.post<ProviderBill>(this.ROOT_URL, providerBill);
  }

  update(providerBill: ProviderBill) {
    return this.http.patch<ProviderBill>(this.ROOT_URL + '/' + providerBill.id, providerBill);
  }

  list(starDate, endDate) {
    return this.http.get<ProviderBill[]>(this.ROOT_URL + '?startDate]=' + starDate + '&&endDate=' + endDate);
  }

  findById(id) {
    return this.http.get<ProviderBill>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<ProviderBill>(this.ROOT_URL + '/' + id);
  }
}
