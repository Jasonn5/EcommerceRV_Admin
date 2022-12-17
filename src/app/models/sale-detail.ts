import { Sale } from "./sale";

export class SaleDetail {
    id?: number;
    stockId: number;
    productName: string;
    businessServiceId: number;
    quantity: number;
    unitaryPrice: number;
    totalPrice: number;
    locationName: string;
    priceList: number[];
    stockQuantity: number;
    sale: Sale;
}