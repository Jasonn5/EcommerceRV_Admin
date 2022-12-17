import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Client } from 'src/app/models/client';
import { Credit } from 'src/app/models/credit';
import { Sale } from 'src/app/models/sale';
import { SaleDetail } from 'src/app/models/sale-detail';
import { Seller } from 'src/app/models/seller';
import { environment } from 'src/environments/environment';
import { SaleDatastoreService } from './sale-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(
    private saleStoreService: SaleDatastoreService,
    private http: HttpClient,
    private auth: AuthService
  ) { }

  public addSale(saleDetails: SaleDetail[], client: Client, saleDate, credit: Credit, seller: Seller) {
    let newSale = new Sale();
    newSale.description = 'Registro de venta';
    newSale.date = saleDate;
    newSale.saleDetails = saleDetails;
    newSale.seller = seller;

    if (credit != null) {
      newSale.credit = credit;
      newSale.client = client;

      return this.saleStoreService.add(newSale);
    }

    if (client.id != 0) {
      newSale.client = client;

      return this.saleStoreService.add(newSale);
    }

    return this.saleStoreService.add(newSale);
  }

  public updateSale(saleToUpdate: Sale, saleDetails: SaleDetail[], client: Client, credit: Credit, seller: Seller) {
    saleToUpdate.saleDetails = [];
    saleToUpdate.saleDetails = saleDetails;
    saleToUpdate.seller = seller;
    saleToUpdate.client = client;
    saleToUpdate.credit = credit;

    return this.saleStoreService.update(saleToUpdate);
  }

  public cancelSale(saleToCancel: Sale) {
    return this.saleStoreService.cancelSale(saleToCancel);
  }

  public listSales(value: string, startDate = null, endDate = null) {
    return this.saleStoreService.list(value, startDate, endDate);
  }

  public findById(id) {
    return this.saleStoreService.findById(id);
  }

  public printBill(billId, isCopy) {
    var url = environment.BACK_END_HOST + 'print/printBill/' + billId + '/' + isCopy;
    let headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }

  public printReceipt(saleId, isCopy) {
    var url = environment.BACK_END_HOST + 'print/printReceipt/' + saleId + '/' + isCopy;
    let headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }

  public getSaleCode(date) {
    return this.saleStoreService.getCode(date);
  }
}
