import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from 'src/app/models/payment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}payments`;

  constructor(private http: HttpClient) { }

  add(payment: Payment) {
    return this.http.post<Payment>(this.ROOT_URL, payment);
  }

  update(payment: Payment) {
    return this.http.patch<Payment>(this.ROOT_URL + '/' + payment.id, payment);
  }

  list(creditId) {
    return this.http.get<Payment[]>(`${environment.BACK_END_HOST}credits/${creditId}/payments`);
  }

  findById(id) {
    return this.http.get<Payment>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<Payment>(this.ROOT_URL + '/' + id);
  }
}
