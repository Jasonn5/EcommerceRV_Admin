import { BillConfiguration } from "./bill-configuration";
import { CashRegister } from "./cash-register";
import { Client } from "./client";
import { Credit } from "./credit";
import { SaleDetail } from "./sale-detail";
import { Seller } from "./seller";

export class Sale {
    id?: number;
    code: string;
    date: Date;
    description: string;
    statusId: number;
    cashRegister: CashRegister;
    credit: Credit;
    client: Client;
    seller: Seller;
    saleDetails: SaleDetail[];
}