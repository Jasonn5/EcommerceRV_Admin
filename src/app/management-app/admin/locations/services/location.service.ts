import { Injectable } from '@angular/core';
import { LocationDatastoreService } from './location-datastore.service';
import { Location } from "src/app/models/location";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private locationDatastoreService: LocationDatastoreService) { }

  listLocations() {
    return this.locationDatastoreService.list();
  }

  public addLocation(location) {
    let newLocation = new Location()
    newLocation.name = location.name;
    newLocation.city = location.city;
    newLocation.address = location.address;
    newLocation.phone = location.phone;

    return this.locationDatastoreService.add(newLocation);
  }

  public updateLocation(locationToEdit: Location, location) {
    locationToEdit.name = location.name;
    locationToEdit.city = location.city;
    locationToEdit.address = location.address;
    locationToEdit.phone = location.phone;

    return this.locationDatastoreService.update(locationToEdit);
  }

  public deleteLocation(id) {
    return this.locationDatastoreService.delete(id);
  }

  public findLocationById(id) {
    return this.locationDatastoreService.findById(id);
  }
}
