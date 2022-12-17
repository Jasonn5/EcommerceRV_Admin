import { Injectable } from '@angular/core';
import { SaleConfiguration } from 'src/app/models/sale-configuration';
import { SaleConfigurationDatastoreService } from './sale-configuration-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class SaleConfigurationService {

  constructor(private saleConfigurationDatastoreService: SaleConfigurationDatastoreService) { }

  getConfiguration(username) {
    return this.saleConfigurationDatastoreService.findByUsername(username);
  }

  updateConfiguration(saleConfigurationChange: SaleConfiguration) {
    saleConfigurationChange.sheetSizeId = parseInt(saleConfigurationChange.sheetSizeId.toString());
    
    return this.saleConfigurationDatastoreService.update(saleConfigurationChange);
  }
}
