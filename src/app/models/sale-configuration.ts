import { BillConfiguration } from "./bill-configuration";
import { CashRegister } from "./cash-register";
import { Location } from "./location"

export class SaleConfiguration {
    id?: number;
    isTableView: boolean;
    listByCategory: boolean;
    sheetSizeId: number;
    location: Location;
    billConfiguration: BillConfiguration;
    cashRegister: CashRegister;
}