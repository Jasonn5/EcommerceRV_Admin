import { Client } from "./client";
import { Sale } from "./sale";

export class Credit{
    id?: number;
    paidAmount: number;
    totalAmount: number;
    creditDays:number;
    isFullyPaid: boolean;
    createdDate: Date;
    creditDate: Date;
    sale: Sale;
    client: Client;
}