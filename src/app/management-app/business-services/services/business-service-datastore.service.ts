import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusinessService } from 'src/app/models/business-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessServiceDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}business-services`;

  constructor(private http: HttpClient) { }

  add(businessService: BusinessService) {
    return this.http.post<BusinessService>(this.ROOT_URL, businessService);
  }

  update(businessService: BusinessService) {
    return this.http.patch<BusinessService>(this.ROOT_URL + '/' + businessService.id, businessService);
  }

  list(value) {
    return this.http.get<BusinessService[]>(this.ROOT_URL + '?search=' + value);
  }

  findById(id) {
    return this.http.get<BusinessService>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<BusinessService>(this.ROOT_URL + '/' + id);
  }
}
