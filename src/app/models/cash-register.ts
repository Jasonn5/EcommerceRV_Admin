import { CashRegisterEntry } from "./cash-register-entry";

export class CashRegister{
    id?: number;
    code: string;
    amount: number;
    cashRegisterType: number;
    cashRegisterEntries: CashRegisterEntry[];
}