import { Bill } from "./bill";

export class BillDetail {
    id?: number;
    productName: string;
    quantity: number;
    unitaryPrice: number;
    totalPrice: number;
    bill: Bill;
}