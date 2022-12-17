import { BillConfiguration } from "./bill-configuration";
import { BillDetail } from "./bill-detail";
import { Sale } from "./sale";

export class Bill {
    id?: number;
    billDate: Date;
    taxPaidName: string;
    nit: string;
    controlCode: string;
    qrCode: string;
    billNumber: number;
    statusId: number;
    sale: Sale;
    billConfiguration: BillConfiguration;
    billDetails: BillDetail[];
}