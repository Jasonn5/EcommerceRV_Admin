import { MerchandiseRegister } from "./merchandise-register";
import { Product } from "./product";

export class MerchandiseDetail {
    id?: number;
    productId: number;
    productName: string;
    productCode: string;
    quantity: number;
    price: number;
    product: Product;
    merchandiseRegister: MerchandiseRegister;
}