import { CashRegister } from "./cash-register";

export class CashRegisterEntry {
    id?: number;
    date: Date;
    amount: number;
    cashRegisterAmount: number;
    reason: string;
    entryType: number;
    cashRegister: CashRegister;
}