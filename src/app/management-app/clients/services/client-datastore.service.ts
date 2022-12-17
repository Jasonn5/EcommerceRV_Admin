import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from 'src/app/models/client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}clients`;

  constructor(private http: HttpClient) { }

  add(client: Client) {
    return this.http.post<Client>(this.ROOT_URL, client);
  }

  update(client: Client) {
    return this.http.patch<Client>(this.ROOT_URL + '/' + client.id, client);
  }

  list(value) {
    return this.http.get<Client[]>(this.ROOT_URL + '?search=' + value);
  }

  findById(id) {
    return this.http.get<Client>(this.ROOT_URL + '/' + id);
  }

  findByNit(nit) {
    return this.http.get<Client>(this.ROOT_URL + '/findByNit/' + nit);
  }

  delete(id) {
    return this.http.delete<Client>(this.ROOT_URL + '/' + id);
  }
}
