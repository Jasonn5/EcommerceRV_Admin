import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MerchandiseRegister } from 'src/app/models/merchandise-register';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseRegisterDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}merchandise-registers`;

  constructor(private http: HttpClient) { }

  add(merchandiseRegister: MerchandiseRegister) {
    return this.http.post<MerchandiseRegister>(this.ROOT_URL, merchandiseRegister);
  }

  update(merchandiseRegister: MerchandiseRegister) {
    return this.http.patch<MerchandiseRegister>(this.ROOT_URL + '/' + merchandiseRegister.id, merchandiseRegister);
  }

  list(startDate, endDate) {
    return this.http.get<MerchandiseRegister[]>(this.ROOT_URL + '?startDate=' + startDate + '&&endDate=' + endDate);
  }

  findById(id) {
    return this.http.get<MerchandiseRegister>(this.ROOT_URL + '/' + id);
  }
}
