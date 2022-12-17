import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Provider } from 'src/app/models/provider';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderDatastoreService {

  readonly ROOT_URL = `${environment.BACK_END_HOST}providers`;

  constructor(private http: HttpClient) { }

  add(provider: Provider) {
    return this.http.post<Provider>(this.ROOT_URL, provider);
  }

  update(provider: Provider) {
    return this.http.patch<Provider>(this.ROOT_URL + '/' + provider.id, provider);
  }

  list(value) {
    return this.http.get<Provider[]>(this.ROOT_URL + '?search=' + value);
  }

  findById(id) {
    return this.http.get<Provider>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<Provider>(this.ROOT_URL + '/' + id);
  }
}
