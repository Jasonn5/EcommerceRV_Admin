import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import { ViewExpensesComponent } from './components/view-expenses/view-expenses.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ExpenseService } from './services/expense.service';
import { ExpenseDatastoreService } from './services/expense-datastore.service';

@NgModule({
  declarations: [AddExpenseComponent, ViewExpensesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NbCardModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSpinnerModule,
    AgGridModule.withComponents([]),
    AppRoutingModule
  ],
  providers: [
    ExpenseService,
    ExpenseDatastoreService
  ]
})
export class ExpensesModule { }
