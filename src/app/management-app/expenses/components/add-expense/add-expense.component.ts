import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { CashRegisterService } from 'src/app/management-app/cash-registers/services/cash-register.service';
import { CashRegister } from 'src/app/models/cash-register';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {
  public addExpenseForm: FormGroup;
  public cashRegisters: CashRegister[] = [];
  public cashRegister: CashRegister;

  constructor(
    private formBuilder: FormBuilder,
    private expenseService: ExpenseService,
    private toastrService: NbToastrService,
    private internetConnectionService: InternetConnectionService,
    private cashRegisterService: CashRegisterService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.internetConnectionService.verifyInternetConnection();
    this.cashRegisterService.listCashRegisters().subscribe(cashRegisters => {
      this.cashRegisters = cashRegisters;
      this.spinner.hide();
    });
    this.buildForm();
  }

  private buildForm() {
    this.addExpenseForm = this.formBuilder.group({
      description: ['', Validators.maxLength(500)],
      'code': ['', [Validators.required, Validators.maxLength(500)]],
      amount: ['', [Validators.required, Validators.pattern(/^(0|[1-9]\d*)?[.]?(0|[1-9]\d*)$/), Validators.maxLength(50)]],
      cashRegisterId: 0,
      file: null,
    });
  }

  addExpense() {
    var expense = this.addExpenseForm.value;
    this.cashRegister = this.cashRegisters.find(c => c.id.toString() === expense.cashRegisterId.toString())
    this.spinner.show();
    this.expenseService.addExpense(expense, this.cashRegister).subscribe(() => {
      this.toastrService.primary('Gasto registrado', 'Éxito');
      this.addExpenseForm.reset();
      this.buildForm();
      this.spinner.hide();
    },error =>{      
      this.toastrService.danger(error.error.error.message, 'Éxito');   
      this.addExpenseForm.reset();
      this.buildForm();   
      this.spinner.hide();
    });
  }

  get description() {
    return this.addExpenseForm.get('description');
  }

  get code() {
    return this.addExpenseForm.get('code');
  }

  get amount() {
    return this.addExpenseForm.get('amount');
  }
}
