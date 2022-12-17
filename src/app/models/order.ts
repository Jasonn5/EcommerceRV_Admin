import { Client } from "./client";
import { OrderDetail } from "./order-detail";
import { Sale } from "./sale";
import { Seller } from "./seller";

export class Order {
    id?: number;
    code: string;
    statusId: number;
    orderDate: Date;
    saleInCash: boolean;
    creditDays: number;
    completedDate: Date;
    isDelivered: boolean;
    client: Client;
    seller: Seller;
    sale: Sale;
    orderDetails: OrderDetail[];
}