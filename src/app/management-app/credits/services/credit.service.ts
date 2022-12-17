import { Injectable } from '@angular/core';
import { Client } from 'src/app/models/client';
import { Credit } from 'src/app/models/credit';
import { CreditDatastoreService } from './credit-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(private creditDatastoreService: CreditDatastoreService) { }

  public addCredit(credit, client: Client) {
    let newCredit = new Credit();
    newCredit.totalAmount = parseFloat(credit.totalAmount);
    newCredit.creditDate = credit.creditDate;
    newCredit.client = client;

    return this.creditDatastoreService.add(newCredit);
  }

  public listCredits(value: string, creditStatus) {
    return this.creditDatastoreService.list(value, creditStatus);
  }

  public deleteCredit(id) {
    return this.creditDatastoreService.delete(id);
  }
}
