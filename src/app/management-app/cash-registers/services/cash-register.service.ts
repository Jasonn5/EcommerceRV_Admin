import { Injectable } from '@angular/core';
import { CashRegister } from 'src/app/models/cash-register';
import { CashRegisterDatastoreService } from './cash-register-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  constructor(private cashRegisterDatastoreService: CashRegisterDatastoreService) { }

  public listCashRegisters() {
    return this.cashRegisterDatastoreService.list();
  }

  public addCashRegister(cashRegister) {
    let newCashRegister = new CashRegister();
    newCashRegister.code = cashRegister.code;
    newCashRegister.amount = parseFloat(cashRegister.amount);
    newCashRegister.cashRegisterType = cashRegister.cashRegisterType;

    return this.cashRegisterDatastoreService.add(newCashRegister);
  }

  public getCashRegisterById(id) {
    return this.cashRegisterDatastoreService.findById(id);
  }

  public updateCashRegister(cashRegisterToEdit: CashRegister, cashRegister) {
    cashRegisterToEdit.code = cashRegister.code;

    return this.cashRegisterDatastoreService.update(cashRegisterToEdit);
  }

  public deleteCashRegister(id) {
    return this.cashRegisterDatastoreService.delete(id);
  }
}
