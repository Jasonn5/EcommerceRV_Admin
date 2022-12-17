import { Injectable } from '@angular/core';
import { Provider } from 'src/app/models/provider';
import { ProviderDatastoreService } from './provider-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private providerDatastoreService: ProviderDatastoreService) { }

  public addProvider(provider) {
    let newProvider = new Provider;
    newProvider.name = provider.name;
    newProvider.address = provider.address;
    newProvider.landLine = provider["land-line"];
    newProvider.cellPhone = provider["cell-phone"];
    newProvider.email = provider.email;

    return this.providerDatastoreService.add(newProvider);
  }

  public updateProvider(providerToEdit: Provider, provider) {
    providerToEdit.name = provider.name;
    providerToEdit.address = provider.address;
    providerToEdit.landLine = provider["land-line"];
    providerToEdit.cellPhone = provider["cell-phone"];
    providerToEdit.email = provider.email;

    return this.providerDatastoreService.update(providerToEdit);
  }

  public searchProviders(value: string) {
    return this.providerDatastoreService.list(value);
  }

  public deleteProvider(id) {
    return this.providerDatastoreService.delete(id);
  }

  public findProviderById(id) {
    return this.providerDatastoreService.findById(id);
  }
}
