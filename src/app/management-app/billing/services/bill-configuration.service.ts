import { Injectable } from '@angular/core';
import { BillConfiguration } from 'src/app/models/bill-configuration';
import { BillConfigurationDatastoreService } from './bill-configuration-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class BillConfigurationService {

  constructor(private billConfigurationDatastoreService: BillConfigurationDatastoreService) { }

  public listBillConfigurations() {
    return this.billConfigurationDatastoreService.list();
  }

  public addBillConfigruation(billConfiguration) {
    let newBillconfiguration = new BillConfiguration();
    newBillconfiguration.code = billConfiguration.code;
    newBillconfiguration.name = billConfiguration.name;
    newBillconfiguration.companyNit = parseInt(billConfiguration.companyNit);
    newBillconfiguration.authorizationNumber = parseInt(billConfiguration.authorizationNumber);
    newBillconfiguration.emissionLimitDate = billConfiguration.emissionLimitDate;
    newBillconfiguration.billStartNumber = parseInt(billConfiguration.billStartNumber);
    newBillconfiguration.billActualNumber = parseInt(billConfiguration.billActualNumber);
    newBillconfiguration.dosageKey = billConfiguration.dosageKey;
    newBillconfiguration.economicActivity = billConfiguration.economicActivity;
    newBillconfiguration.legend = billConfiguration.legend;
    newBillconfiguration.providerName = billConfiguration.providerName;
    newBillconfiguration.matrixHouse = billConfiguration.matrixHouse;
    newBillconfiguration.location = billConfiguration.location;

    return this.billConfigurationDatastoreService.add(newBillconfiguration);
  }

  public updateBillConfiguration(billConfigurationToEdit: BillConfiguration, billConfiguration) {
    billConfigurationToEdit.code = billConfiguration.code;
    billConfigurationToEdit.name = billConfiguration.name;
    billConfigurationToEdit.companyNit = parseInt(billConfiguration.companyNit);
    billConfigurationToEdit.authorizationNumber = parseInt(billConfiguration.authorizationNumber);
    billConfigurationToEdit.emissionLimitDate = billConfiguration.emissionLimitDate;
    billConfigurationToEdit.billStartNumber = parseInt(billConfiguration.billStartNumber);
    billConfigurationToEdit.billActualNumber = parseInt(billConfiguration.billActualNumber);
    billConfigurationToEdit.dosageKey = billConfiguration.dosageKey;
    billConfigurationToEdit.economicActivity = billConfiguration.economicActivity;
    billConfigurationToEdit.legend = billConfiguration.legend;
    billConfigurationToEdit.providerName = billConfiguration.providerName;
    billConfigurationToEdit.matrixHouse = billConfiguration.matrixHouse;
    billConfigurationToEdit.location = billConfiguration.location;

    return this.billConfigurationDatastoreService.update(billConfigurationToEdit);
  }

  public findById(id) {
    return this.billConfigurationDatastoreService.findById(id);
  }

  public deleteBillConfiguration(id) {
    return this.billConfigurationDatastoreService.delete(id);
  }
}
