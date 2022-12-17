import { Injectable } from '@angular/core';
import { BusinessService } from 'src/app/models/business-service';
import { BusinessServiceDatastoreService } from './business-service-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessServiceService {

  constructor(private businessServiceDatastoreService: BusinessServiceDatastoreService) { }

  public addBusinessService(service) {
    let newService = new BusinessService();
    newService.code = service.code;
    newService.businessServiceName = service.name;
    newService.description = service.description;
    newService.price = parseFloat(service.price);
    newService.durationTime = service.duration;
    newService.durationMeasureId = parseInt(service.durationMeasureId);

    return this.businessServiceDatastoreService.add(newService);
  }

  public updateBusinessService(serviceToEdit: BusinessService, service) {
    serviceToEdit.code = service.code;
    serviceToEdit.businessServiceName = service.name;
    serviceToEdit.description = service.description;
    serviceToEdit.price = parseFloat(service.price);
    serviceToEdit.durationTime = service.duration;
    serviceToEdit.durationMeasureId = parseInt(service.durationMeasureId);

    return this.businessServiceDatastoreService.update(serviceToEdit);
  }

  public searchBusinessServices(value: string) {
    return this.businessServiceDatastoreService.list(value);
  }

  public findBusinessServiceById(id) {
    return this.businessServiceDatastoreService.findById(id);
  }

  public deleteBusinessService(id) {
    return this.businessServiceDatastoreService.delete(id);
  }
}
