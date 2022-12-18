import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Stock } from 'src/app/models/stock';
import { TransferStockDetail } from 'src/app/models/transfer-stock-detail'
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { StockService } from '../../services/stock.service';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/management-app/admin/locations/services/location.service';
import { TransferStock } from 'src/app/models/transfer-stock';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transfer-stocks-between-locations',
  templateUrl: './transfer-stocks-between-locations.component.html',
  styleUrls: ['./transfer-stocks-between-locations.component.scss']
})
export class TransferStocksBetweenLocationsComponent implements OnInit {
  public originStockList: Stock[] = [];
  public targetStockList: Stock[] = [];
  public selectedStock: Stock;
  public locations: Location[] = [];
  public locationIdOne: number = 0;
  public locationIdTwo: number = 0;
  public quantityTransfer: number = 1;
  public transferStockDetails: TransferStockDetail[] = [];

  constructor(
    private locationService: LocationService,
    private stockService: StockService,
    private toastrService: NbToastrService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.selectedStock = new Stock();
    this.spinner.show();
    this.locationService.listLocations().subscribe(locations => {
      this.locations = locations;
      if (this.locations.length > 0) {
        this.locationIdOne = this.locations[0].id;
        this.locationIdTwo = this.locations[0].id;
        this.getStocksByLocation(true);
        this.getStocksByLocation(false);
      }
      this.spinner.hide();
    });
  }

  getStocksByLocation(firstLocation: boolean) {
    /* if (firstLocation) {
      this.spinner.show();
      this.stockService.getStocksByLocation('', this.locationIdOne).subscribe(stocks => {
        this.originStockList = stocks;
        this.spinner.hide();
      });
    } else {
      this.spinner.show();
      this.stockService.getStocksByLocation('', this.locationIdTwo).subscribe(stocks => {
        this.targetStockList = stocks;
        this.spinner.hide();
      });
    } */
  }

  selectStock(selectedStock: Stock) {
    this.selectedStock = selectedStock;
  }

  transferStock() {
    this.spinner.show();
    var transferStockDetail = new TransferStockDetail();
    transferStockDetail.fromStockId = this.selectedStock.id;
    transferStockDetail.quantity = this.quantityTransfer;
    transferStockDetail.productId = this.selectedStock.product.id
    this.transferStockDetails.push(transferStockDetail);
    var transferStock = new TransferStock();
    transferStock.fromLocationId = this.locationIdOne;
    transferStock.toLocationId = this.locationIdTwo;
    transferStock.transferStockDetails = this.transferStockDetails;
    this.stockService.transferStock(transferStock).subscribe(() => {
      this.getStocksByLocation(true);
      this.getStocksByLocation(false);
      this.spinner.hide();
      this.transferStockDetails = [];
      this.toastrService.primary('Tranferecia realizada exitosamente', 'Exito');
    }, error => {
      this.spinner.hide();
      this.toastrService.danger(error.error.error.message, 'Error');
    });
  }
}
