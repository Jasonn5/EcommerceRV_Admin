import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BillConfiguration } from 'src/app/models/bill-configuration';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillConfigurationDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}bill-configurations`;

  constructor(private http: HttpClient) { }

  add(billConfiguration: BillConfiguration) {
    return this.http.post<BillConfiguration>(this.ROOT_URL, billConfiguration);
  }

  update(billConfiguration: BillConfiguration) {
    return this.http.patch<BillConfiguration>(this.ROOT_URL + '/' + billConfiguration.id, billConfiguration);
  }

  list() {
    return this.http.get<BillConfiguration[]>(this.ROOT_URL);
  }

  findById(id) {
    return this.http.get<BillConfiguration>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<BillConfiguration>(this.ROOT_URL + '/' + id);
  }
}
