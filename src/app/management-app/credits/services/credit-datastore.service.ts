import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credit } from 'src/app/models/credit';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}credits`;

  constructor(private http: HttpClient) { }

  add(credit: Credit) {
    return this.http.post<Credit>(this.ROOT_URL, credit);
  }

  list(value, creditStatus) {
    return this.http.get<Credit[]>(this.ROOT_URL + '?search=' + value + '&&creditStatus=' + creditStatus);
  }

  delete(id) {
    return this.http.delete<Credit>(this.ROOT_URL + '/' + id);
  }
}
