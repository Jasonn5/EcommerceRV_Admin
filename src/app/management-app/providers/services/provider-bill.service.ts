import { Injectable } from '@angular/core';
import { ProviderBill } from 'src/app/models/provider-bill';
import { ProviderBillDatastoreService } from './provider-bill-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderBillService {

  constructor(private providerBillDatastoreService: ProviderBillDatastoreService) { }

  public addProviderBill(providerBill) {
    let newProviderBill = new ProviderBill();
    newProviderBill.providerName = providerBill.name;
    newProviderBill.nit = parseInt(providerBill.nit);
    newProviderBill.authorizationNumber = parseInt(providerBill["authorization-number"]);
    newProviderBill.billNumber = parseInt(providerBill["bill-number"]);
    newProviderBill.totalAmount = parseFloat(providerBill["total-amount"]);
    newProviderBill.controlCode = providerBill["control-code"];
    newProviderBill.billDate = providerBill["bill-date"];
    newProviderBill.purchaseType = parseInt(providerBill.purchaseType);
    newProviderBill.duiNumber = providerBill.duiNumber;

    return this.providerBillDatastoreService.add(newProviderBill);
  }

  public updateProviderBill(providerBillToEdit: ProviderBill, providerBill) {
    providerBillToEdit.providerName = providerBill.name;
    providerBillToEdit.nit = parseInt(providerBill.nit);
    providerBillToEdit.authorizationNumber = parseInt(providerBill["authorization-number"]);
    providerBillToEdit.billNumber = parseInt(providerBill["bill-number"]);
    providerBillToEdit.totalAmount = parseFloat(providerBill["total-amount"]);
    providerBillToEdit.controlCode = providerBill["control-code"];
    providerBillToEdit.billDate = providerBill["bill-date"];
    providerBillToEdit.purchaseType = parseInt(providerBill.purchaseType);
    providerBillToEdit.duiNumber = providerBill.duiNumber;

    return this.providerBillDatastoreService.update(providerBillToEdit);
  }

  public searchProvidersBill(startDate = null, endDate = null) {
    return this.providerBillDatastoreService.list(startDate, endDate);
  }

  public deleteProviderBill(id) {
    return this.providerBillDatastoreService.delete(id);
  }

  public findProviderBillById(id) {
    return this.providerBillDatastoreService.findById(id);
  }
}
