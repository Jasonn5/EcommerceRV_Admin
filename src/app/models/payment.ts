import { Client } from "./client";
import { Credit } from "./credit";

export class Payment {
    id?: number;
    amount: number;
    createdDate: Date;
    saleCode: string;
    paymentDate: Date;
    reference: string;
    credit: Credit;
    client: Client;
}