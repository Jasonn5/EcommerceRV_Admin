import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaleConfiguration } from 'src/app/models/sale-configuration';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleConfigurationDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}sale-configurations`;

  constructor(private http: HttpClient) { }

  update(saleConfiguration: SaleConfiguration) {
    return this.http.patch<SaleConfiguration>(this.ROOT_URL + '/' + saleConfiguration.id, saleConfiguration);
  }

  findByUsername(username) {
    return this.http.get<SaleConfiguration>(this.ROOT_URL + '/' + username);
  }
}
