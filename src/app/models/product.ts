import { Category } from "./category";
import { SubCategory } from "./sub-category";

export class Product {
    id?: number;
    name: string;
    code: string;
    description: string;
    price: number;
    priceB: number;
    priceC: number;
    priceD: number;
    priceE: number;
    discount: number;
    pack: string;
    size: string;
    codebar: string;
    measureTypeId: number;
    stockAlarm: number;
    imageUrl: string;
    displayName: string;
    category: Category;
    subCategory: SubCategory;
}