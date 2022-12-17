import { CashRegister } from "./cash-register";

export class Expense {
    id?: number;
    code: string;
    amount: number;
    description: number;
    date: Date;
    cashRegister: CashRegister;
}