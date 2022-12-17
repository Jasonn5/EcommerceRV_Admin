import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CashRegister } from 'src/app/models/cash-register';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}cash-registers`;

  constructor(private http: HttpClient) { }

  add(cashRegister: CashRegister) {
    return this.http.post<CashRegister>(this.ROOT_URL, cashRegister);
  }

  update(cashRegister: CashRegister) {
    return this.http.patch<CashRegister>(this.ROOT_URL + '/' + cashRegister.id, cashRegister);
  }

  list() {
    return this.http.get<CashRegister[]>(this.ROOT_URL);
  }

  findById(id) {
    return this.http.get<CashRegister>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete(this.ROOT_URL + '/' + id);
  }
}
