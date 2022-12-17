import { Injectable } from '@angular/core';
import { Seller } from 'src/app/models/seller';
import { SellerDatastoreService } from './seller-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  
  constructor(private sellerDatastoreService: SellerDatastoreService) { }

  public addSeller(seller) {
    let newSeller = new Seller();
    newSeller.name = seller.name;
    newSeller.code = seller.code;
    newSeller.address = seller.address;
    newSeller.email = seller.email;
    newSeller.cellPhone = seller.cellPhone;
    newSeller.landLine = seller.landLine;

    return this.sellerDatastoreService.add(newSeller);
  }

  public updateSeller(sellerToEdit: Seller, seller) {
    sellerToEdit.name = seller.name;
    sellerToEdit.code = seller.code;
    sellerToEdit.address = seller.address;
    sellerToEdit.email = seller.email;
    sellerToEdit.cellPhone = seller.cellPhone;
    sellerToEdit.landLine = seller.landLine;

    return this.sellerDatastoreService.update(sellerToEdit);
  }

  public listSellers(value: string) {
    return this.sellerDatastoreService.list(value);
  }

  public findById(id) {
    return this.sellerDatastoreService.findById(id);
  }
}
