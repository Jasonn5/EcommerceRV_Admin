import { Injectable } from '@angular/core';
import { Client } from 'src/app/models/client';
import { ClientDatastoreService } from './client-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private clientDatastoreService: ClientDatastoreService) { }

  public addClient(client) {
    let newClient = new Client();
    newClient.name = client.name;
    newClient.description = client.description;
    newClient.address = client.address;
    newClient.email = client.email;
    newClient.cellPhone = client["cell-phone"];
    newClient.landLine = client["land-line"];
    newClient.nit = parseInt(client.nit);
    newClient.latitude = client.latitude;
    newClient.longitude = client.longitude;
    newClient.businessName = client.businessName;

    return this.clientDatastoreService.add(newClient);
  }

  public updateClient(clientToEdit: Client, client) {
    clientToEdit.name = client.name;
    clientToEdit.description = client.description;
    clientToEdit.address = client.address;
    clientToEdit.email = client.email;
    clientToEdit.cellPhone = client["cell-phone"];
    clientToEdit.landLine = client["land-line"];
    clientToEdit.nit = parseInt(client.nit);
    clientToEdit.latitude = client.latitude;
    clientToEdit.longitude = client.longitude;
    clientToEdit.businessName = client.businessName;

    return this.clientDatastoreService.update(clientToEdit);
  }

  public searchClients(value: string) {
    return this.clientDatastoreService.list(value);
  }

  public deleteClient(id) {
    return this.clientDatastoreService.delete(id);
  }

  public findClientById(id) {
    return this.clientDatastoreService.findById(id);
  }

  public findClientByNit(nit) {
    return this.clientDatastoreService.findByNit(nit);
  }
}
