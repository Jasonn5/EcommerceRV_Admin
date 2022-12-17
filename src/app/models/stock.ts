import { Product } from "./product";
import { Location } from "./location";

export class Stock {
    id?: number;
    quantity: number;
    price: number;
    categoryName: string;
    product: Product;
    location: Location;
}