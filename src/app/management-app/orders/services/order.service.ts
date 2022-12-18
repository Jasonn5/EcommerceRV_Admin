import { Injectable } from '@angular/core';
import { Client } from 'src/app/models/client';
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/order-detail';
import { Seller } from 'src/app/models/seller';
import { OrderDatastoreService } from './order-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private orderDatastoreService: OrderDatastoreService,) { }

  public addOrder(order: Order, orderDetails: OrderDetail[]) {
    let newOrder = new Order();
    newOrder.saleInCash = order.saleInCash;
    newOrder.creditDays = order.creditDays;
    newOrder.orderDetails = orderDetails;

    return this.orderDatastoreService.add(newOrder);
  }

  public updateOrder(order: Order, orderDetails: OrderDetail[]) {
    order.orderDetails = [];
    order.orderDetails = orderDetails;

    return this.orderDatastoreService.update(order);
  }

  public updateOrderStatus(order: Order) {
    order.orderDetails = order.orderDetails;
    order.client = order.client;
    order.seller = order.seller;

    return this.orderDatastoreService.updateStatus(order);
  }

  public listOrders(statusId, sellerId, startDate, endDate, value) {
    return this.orderDatastoreService.list(value, statusId, sellerId, startDate, endDate);
  }

  public findById(id) {
    return this.orderDatastoreService.findById(id);
  }

  public generatePreOrder(orderDetails: OrderDetail[], client: Client) {
    var order = new Order();
    order.orderDetails = orderDetails;
    order.client = client;

    return this.orderDatastoreService.generatePreOrder(order);
  }
}
