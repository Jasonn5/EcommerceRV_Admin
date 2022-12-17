import { Order } from "./order";

export class OrderDetail {
    id?: number;
    stockId: number;
    productName: string;
    quantity: number;
    unitaryPrice: number;
    totalPrice: number;
    locationName: string;
    priceList: number[];
    order: Order;
}