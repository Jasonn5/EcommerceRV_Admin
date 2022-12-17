import { Injectable } from '@angular/core';
import { CashRegister } from 'src/app/models/cash-register';
import { Expense } from 'src/app/models/expense';
import { ExpenseDatastoreService } from './expense-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private expenseDatastoreService: ExpenseDatastoreService) { }

  public addExpense(expense, cashRegister: CashRegister) {
    let newExpense = new Expense();
    newExpense.code = expense.code;
    newExpense.amount = parseInt(expense.amount);
    newExpense.description = expense.description;
    newExpense.cashRegister = cashRegister;

    return this.expenseDatastoreService.add(newExpense);
  }

  public searchExpenses(value: string) {
    return this.expenseDatastoreService.list(value);
  }
}
