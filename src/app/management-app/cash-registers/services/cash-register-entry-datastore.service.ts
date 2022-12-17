import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CashRegisterEntry } from 'src/app/models/cash-register-entry';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterEntryDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}cash-register-entries`;

  constructor(private http: HttpClient) { }

  add(cashRegisterEntry: CashRegisterEntry) {
    return this.http.post<CashRegisterEntry>(this.ROOT_URL, cashRegisterEntry);
  }

  list(startDate = null, endDate = null) {
    return this.http.get<CashRegisterEntry[]>(this.ROOT_URL + '?startDate=' + startDate + '&endDate=' + endDate);
  }

  listByCashRegister(startDate, endDate, cashRegisterId: number) {
    return this.http.get<CashRegisterEntry[]>(this.ROOT_URL + '/getByCashRegister?startDate=' + startDate + '&endDate=' + endDate + '&cashRegisterId=' + cashRegisterId);
  }

  deleteEntriesByCashRegisterId(cashRegisterId: number) {
    return this.http.delete(`${environment.BACK_END_HOST}cash-register-entries/${cashRegisterId}`);
  }
}
