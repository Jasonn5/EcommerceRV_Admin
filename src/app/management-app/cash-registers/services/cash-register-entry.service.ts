import { Injectable } from '@angular/core';
import { CashRegister } from 'src/app/models/cash-register';
import { CashRegisterEntry } from 'src/app/models/cash-register-entry';
import { CashRegisterEntryDatastoreService } from './cash-register-entry-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterEntryService {

  constructor(private cashRegisterEntryDatastoreService: CashRegisterEntryDatastoreService) { }

  public listCashRegisterEntries(startDate = null, endDate = null) {
    return this.cashRegisterEntryDatastoreService.list(startDate, endDate);
  }

  public addEntry(entry, cashRegister: CashRegister) {
    let newEntry = new CashRegisterEntry();
    newEntry.amount = parseFloat(entry.amount);
    newEntry.reason = entry.reason;
    newEntry.entryType = parseInt(entry.entryType);
    newEntry.cashRegister = cashRegister;

    return this.cashRegisterEntryDatastoreService.add(newEntry);
  }

  public listEntriesByCashRegister(startDate = null, endDate = null, cashRegisterId: number) {
    return this.cashRegisterEntryDatastoreService.listByCashRegister(startDate, endDate, cashRegisterId);
  }

  public deleteEntriesByCashRegisterId(cashRegisterId: number) {
    return this.cashRegisterEntryDatastoreService.deleteEntriesByCashRegisterId(cashRegisterId);
  }
}
