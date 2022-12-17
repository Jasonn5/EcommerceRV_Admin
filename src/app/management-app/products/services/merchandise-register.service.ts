import { Injectable } from '@angular/core';
import { Location } from 'src/app/models/location';
import { MerchandiseDetail } from 'src/app/models/merchandise-detail';
import { MerchandiseRegister } from 'src/app/models/merchandise-register';
import { Provider } from 'src/app/models/provider';
import { MerchandiseRegisterDatastoreService } from './merchandise-register-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseRegisterService {

  constructor(private merchandiseRegisterDatastoreService: MerchandiseRegisterDatastoreService) { }

  public addMerchandiseRegister(merchandiseDetails: MerchandiseDetail[], location: Location, registerDate: Date, provider: Provider, billNumber: string, billUrl: string, generateExpense: boolean) {
    let newMerchandiseRegister = new MerchandiseRegister();
    newMerchandiseRegister.registerDate = registerDate;
    newMerchandiseRegister.billNumber = billNumber;
    newMerchandiseRegister.billUrl = billUrl;
    newMerchandiseRegister.location = location;
    newMerchandiseRegister.merchandiseDetails = merchandiseDetails;
    newMerchandiseRegister.provider = provider;
    newMerchandiseRegister.generateExpense = generateExpense;

    return this.merchandiseRegisterDatastoreService.add(newMerchandiseRegister);
  }

  public updateMerchandiseRegister(merchandiseRegister: MerchandiseRegister, merchandiseDetails: MerchandiseDetail[], location: Location, registerDate: Date, provider: Provider, billNumber: string, billUrl: string) {
    merchandiseRegister.registerDate = registerDate;
    merchandiseRegister.billNumber = billNumber;
    merchandiseRegister.billUrl = billUrl;
    merchandiseRegister.location = location;
    merchandiseRegister.merchandiseDetails = merchandiseDetails;
    merchandiseRegister.provider = provider;

    return this.merchandiseRegisterDatastoreService.update(merchandiseRegister);
  }

  public listMerchandiseRegisters(startDate = null, endDate = null) {
    return this.merchandiseRegisterDatastoreService.list(startDate, endDate);
  }

  public findById(id) {
    return this.merchandiseRegisterDatastoreService.findById(id);
  }
}
