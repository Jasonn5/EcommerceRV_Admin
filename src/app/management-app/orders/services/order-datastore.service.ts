import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Order } from 'src/app/models/order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}orders`;

  constructor(private http: HttpClient) { }

  add(order: Order) {
    return this.http.post<Order>(this.ROOT_URL, order);
  }

  update(order: Order) {
    return this.http.patch<Order>(this.ROOT_URL + '/update-order/orders/' + order.id, order);
  }

  updateStatus(order: Order) {
    return this.http.patch<Order>(this.ROOT_URL + '/' + order.id, order);
  }

  list(value, statusId, sellerId, startDate, endDate) {
    return this.http.get<Order[]>(this.ROOT_URL
      + '?search=' + value
      + '&&statusId=' + statusId
      + '&&sellerId=' + sellerId
      + '&&startDate=' + startDate
      + '&&endDate=' + endDate);
  }

  findById(id) {
    return this.http.get<Order>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<Order>(this.ROOT_URL + '/' + id);
  }

  generatePreOrder(order){
    return this.http.post(this.ROOT_URL + '/generate-pre-order', order, { responseType : 'blob' });
  }
}
