import { Injectable } from '@angular/core';
import { Location } from 'src/app/models/location';
import { Product } from 'src/app/models/product';
import { Stock } from 'src/app/models/stock';
import { TransferStock } from 'src/app/models/transfer-stock';
import { TransferStockDetail } from 'src/app/models/transfer-stock-detail';
import { StockDatastoreService } from './stock-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private stockDatatoreService: StockDatastoreService) { }

  public addStock(quantity, price, product: Product) {
    let newStock = new Stock;
    newStock.quantity = parseInt(quantity);
    newStock.price = parseFloat(price);
    newStock.categoryName = product.category != null ? product.category.name : '';
    newStock.product = product;

    return this.stockDatatoreService.add(newStock);
  }

  public updtateStock(stockToEdit: Stock, quantity, product: Product) {
    stockToEdit.quantity = parseInt(quantity);
    stockToEdit.product = product;

    return this.stockDatatoreService.update(stockToEdit);
  }

  public searchStocks() {
    return this.stockDatatoreService.list();
  }


  public findById(id) {
    return this.stockDatatoreService.findById(id);
  }

  public transferStock(transferStock: TransferStock){
    return this.stockDatatoreService.transferStock(transferStock);
  }
}
