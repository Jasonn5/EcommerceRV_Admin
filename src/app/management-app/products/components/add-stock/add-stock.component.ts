import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { LocationService } from 'src/app/management-app/admin/locations/services/location.service';
import { Location } from 'src/app/models/location';
import { Product } from 'src/app/models/product';
import { Stock } from 'src/app/models/stock';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss']
})
export class AddStockComponent implements OnInit {
  public selectedProduct: Product;
  public locationId: number = 0;
  public quantity: number = 1;
  public stocks: Stock[] = [];
  public canSubtract: boolean = false;
  public modifyPrice: boolean = false;
  public productPrice = 0;
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;
  public searchIsEmpty: boolean = true;
  public searchText: string;

  constructor(
    private locationService: LocationService,
    private stockService: StockService,
    private toastrService: NbToastrService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.internetConnectionService.verifyInternetConnection();
    this.selectedProduct = new Product();
    this.searchText = '';

    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.getStocksByLocation(text);
    });
  }

  selectProduct(product: Product) { 
    this.selectedProduct = product;
    this.canSubtract = this.stocks.find(s => s.product.id == this.selectedProduct.id) ? true : false;
  }


  addOrSubtractStock(value: boolean = false) {
    if (this.stocks.find(s => s.product.id == this.selectedProduct.id)) {
      this.spinner.show();
      var stockToEdit = this.stocks.find(s => s.product.id == this.selectedProduct.id);
      if (value) {
        this.quantity = stockToEdit.quantity - this.quantity;
        stockToEdit.price = 0;
      } else {
        this.quantity = stockToEdit.quantity + this.quantity;
        stockToEdit.price = this.modifyPrice ? parseFloat(this.productPrice.toString()) : parseFloat(this.selectedProduct.price.toString());
      }
      this.stockService.updtateStock(stockToEdit, this.quantity, this.selectedProduct).subscribe(() => {
        this.toastrService.primary('Stock de producto actualizado', 'Éxito');
        this.getStocksByLocation(this.searchText);
        this.quantity = 1;
        this.modifyPrice = false;
        this.productPrice = 0;
        this.spinner.hide();
      },
        (error) => {
          this.toastrService.danger(error.error.message, 'Error');
          this.getStocksByLocation(this.searchText);
          this.quantity = 1;
          this.spinner.hide();
        }
      );
    } else {
      this.spinner.show();
      var price = this.modifyPrice ? parseFloat(this.productPrice.toString()) : parseFloat(this.selectedProduct.price.toString());
      this.stockService.addStock(this.quantity, price, this.selectedProduct).subscribe(() => {
        this.toastrService.primary('Stock de producto registrado', 'Éxito');
        this.getStocksByLocation(this.searchText);
        this.quantity = 1;
        this.modifyPrice = false;
        this.productPrice = 0;
        this.spinner.hide();
      });
    }
  }

  getStocksByLocation(value: string) {debugger;
    this.spinner.show();
    this.stockService.searchStocks().subscribe(stocks => {debugger;
      this.stocks = stocks;
      this.searchIsEmpty = value == '';
      this.searchText = value;
      this.canSubtract = this.stocks.find(s => s.product.id == this.selectedProduct.id) ? true : false;
      this.spinner.hide();
    });
  }
}
