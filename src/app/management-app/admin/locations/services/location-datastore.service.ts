import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Location } from "src/app/models/location";

@Injectable({
  providedIn: 'root'
})
export class LocationDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}locations`;

  constructor(private http: HttpClient) { }

  add(location: Location) {
    return this.http.post<Location>(this.ROOT_URL, location);
  }

  update(location: Location) {
    return this.http.patch<Location>(this.ROOT_URL + '/' + location.id, location);
  }

  list() {
    return this.http.get<Location[]>(this.ROOT_URL);
  }

  findById(id) {
    return this.http.get<Location>(this.ROOT_URL + '/' + id);
  }

  delete(id) {
    return this.http.delete<Location>(this.ROOT_URL + '/' + id);
  }
}
