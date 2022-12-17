import { Injectable } from '@angular/core';
import { Bill } from 'src/app/models/bill';
import { BillDetail } from 'src/app/models/bill-detail';
import { Sale } from 'src/app/models/sale';
import { BillDatastoreService } from './bill-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private billDatastoreService: BillDatastoreService) { }

  public addBill(billDetails: BillDetail[], sale: Sale, billDate, taxPaidName, nit) {
    let newBill = new Bill();
    newBill.billDate = billDate;
    newBill.taxPaidName = taxPaidName;
    newBill.nit = nit;
    newBill.sale = sale;
    newBill.billDetails = billDetails;

    return this.billDatastoreService.add(newBill);
  }

  public updateBill(billToEdit: Bill) {
    return this.billDatastoreService.update(billToEdit);
  }

  public listBillsBySale(saleId) {
    return this.billDatastoreService.list(saleId);
  }

  public findById(id) {
    return this.billDatastoreService.findById(id);
  }
}
