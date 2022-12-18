import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDatepickerConfig, NgbModal, NgbModalOptions, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { SaleConfigurationService } from 'src/app/management-app/admin/services/sale-configuration.service';
import { ClientService } from 'src/app/management-app/clients/services/client.service';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { NotificationService } from 'src/app/management-app/products/services/notification.service';
import { StockService } from 'src/app/management-app/products/services/stock.service';
import { SellerService } from 'src/app/management-app/sellers/services/seller.service';
import { SharedService } from 'src/app/management-app/services/shared.service';
import { BillConfiguration } from 'src/app/models/bill-configuration';
import { CashRegister } from 'src/app/models/cash-register';
import { Client } from 'src/app/models/client';
import { Credit } from 'src/app/models/credit';
import { Sale } from 'src/app/models/sale';
import { SaleConfiguration } from 'src/app/models/sale-configuration';
import { SaleDetail } from 'src/app/models/sale-detail';
import { Seller } from 'src/app/models/seller';
import { Stock } from 'src/app/models/stock';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { SaleService } from '../../services/sale.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent implements OnInit {
  public stocks: Stock[] = [];
  public productsGroupedByCategory: any;
  public saleDetails: SaleDetail[] = [];
  private saleDetailId: number;
  public searchProductsIsEmpty: boolean = true;
  public searchServicesIsEmpty: boolean = true;
  @ViewChild('searchProduct', { static: true }) searchProduct: ElementRef;
  public saleDate: NgbDate;
  public reloadSaleDetail: Subject<boolean> = new Subject<boolean>();
  public reloadProducts: Subject<boolean> = new Subject<boolean>();
  public modalOptions: NgbModalOptions;
  public totalCost = 0;
  public isFromSale: boolean = true;
  public saleCode;
  public activeNotifications: boolean;
  public activeId = 1;
  public isAdmin: boolean;

  constructor(
    private saleService: SaleService,
    private toastrService: NbToastrService,
    private stockService: StockService,
    private authService: AuthService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    private datepipe: DatePipe,
    private internetConnectionService: InternetConnectionService,
    private notificationService: NotificationService,
    private sharedService: SharedService,
    private pdfService: PdfService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.isAdmin = this.authService.getRoles().includes('Admin');
    this.sharedService.sharedResult.subscribe(result => this.activeNotifications = result);
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      centered: true
    }
    this.saleCode = new Sale();
    this.saleDetailId = 0;
    this.saleDetails = [];
    this.saleDate = this.calendar.getToday();
    const currentDate = new Date();
    this.config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() }
    this.getSaleCode();
    fromEvent(this.searchProduct.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchProducts(text);
    });
    this.searchProducts("s");
  }

  getSaleCode() {
    var date = this.datepipe.transform(new Date(this.saleDate.year, this.saleDate.month - 1, this.saleDate.day, 0, 0, 0), 'yyyy-MM-dd');
    this.saleService.getSaleCode(date).subscribe(sale => {
      this.saleCode = sale;
    });
  }


  searchProducts(value: string) {
    this.spinner.show();
      this.stockService.searchStocks().subscribe(stocks => {
        this.saleDetails.forEach(sd => {
          var stock = stocks.find(s => s.id == sd.stockId);
          if (stock) {
            stock.quantity -= sd.quantity;
          }
        });
        this.stocks = stocks;
        this.searchProductsIsEmpty = value == '';
        this.activeId = this.stocks.length == 0 && this.searchProductsIsEmpty ? 2 : 1;
       
        this.spinner.hide();
      });
    
  }



  addProductToSaleDetail(stock: Stock) {
    if (stock.quantity > 0) {
      var newSaleDetail = new SaleDetail();
      newSaleDetail.stockId = stock.id;
      newSaleDetail.productName = stock.product.name;
      newSaleDetail.quantity = 1;
      newSaleDetail.unitaryPrice = stock.product.price;
      newSaleDetail.totalPrice = stock.product.price;
      this.saleDetailId++;
      newSaleDetail.id = this.saleDetailId;
      this.editSaleDetail(newSaleDetail);
    }
  }


  getTotalCost() {
    return this.saleDetails.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
  }

  editSaleDetail(saleDetail: SaleDetail) {
    this.modalOptions.size = 'md';
    var stock = this.stocks.find(s => s.id == saleDetail.stockId);
    var sd = this.saleDetails.find(sd => sd.id == saleDetail.id);
    const modalRef = this.modalService.open(EditSaleDetailDialogComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      saleDetailUnitaryPrice: saleDetail.unitaryPrice,
      saleDetailQuantity: saleDetail.quantity,
      productStock: stock ? sd ? stock.quantity + saleDetail.quantity : stock.quantity : saleDetail.stockQuantity + saleDetail.quantity,
      priceList: saleDetail.priceList,
      stockId: saleDetail.stockId
    };
    modalRef.result.then((result) => {
      if (result) {
        saleDetail.totalPrice = result.saleDetailQuantity * result.saleDetailUnitaryPrice;
        saleDetail.unitaryPrice = result.saleDetailUnitaryPrice;
        saleDetail.stockQuantity = result.productStock - result.saleDetailQuantity;
        saleDetail.quantity = result.saleDetailQuantity;
        if (stock) {
          stock.quantity = result.productStock - result.saleDetailQuantity;
        }
        if (!sd) {
          this.saleDetails.push(saleDetail);
        }
        this.totalCost = this.getTotalCost();
        this.reloadSaleDetail.next(true);
        this.reloadProducts.next(true);
      }
    });
    this.totalCost = this.getTotalCost();
    this.reloadSaleDetail.next(true);
    this.reloadProducts.next(true);
  }

  addSale() {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Venta';
    modalRef.componentInstance.message = '¿Desea registrar la venta?';
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var date = new Date(this.saleDate.year, this.saleDate.month - 1, this.saleDate.day, 0, 0, 0);
        var saleDate = this.datepipe.transform(date, "yyyy-MM-dd");
        this.saleService.addSale(this.saleDetails,saleDate).subscribe(sale => {
          this.toastrService.primary('Venta registrada', 'Éxito', {});
          this.saleDetails = [];
          this.saleDate = this.calendar.getToday();
          this.totalCost = 0;
          this.getSaleCode();
          this.saleService.printReceipt(sale.id, false).subscribe(pdf => {
            this.pdfService.Open(pdf);
            this.spinner.hide();
          });
        },
          (error) => {
            this.toastrService.danger(error.error.message, 'Error');
            this.spinner.hide();
          });
      }
    });
  }

  removeSaleDetail(saleDetail: SaleDetail) {
    this.modalOptions.size = 'sm';
    if (saleDetail.stockId != 0) {
      var stock = this.stocks.find(s => s.id == saleDetail.stockId);
      const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
      modalRef.componentInstance.title = 'Remover producto';
      modalRef.componentInstance.message = '¿Desea remover el producto ' + saleDetail.productName + '?';
      modalRef.result.then((result) => {
        if (result) {
          var index = this.saleDetails.indexOf(saleDetail);
          if (index > -1) {
            this.saleDetails.splice(index, 1);
          }
          stock.quantity = stock.quantity + saleDetail.quantity;
          this.totalCost = this.getTotalCost();
          this.reloadSaleDetail.next(true);
          this.reloadProducts.next(true);
        }
      });
    } else {
      const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
      modalRef.componentInstance.title = 'Remover servicio';
      modalRef.componentInstance.message = '¿Desea remover el servicio ' + saleDetail.productName + '?';
      modalRef.result.then((result) => {
        if (result) {
          var index = this.saleDetails.indexOf(saleDetail);
          if (index > -1) {
            this.saleDetails.splice(index, 1);
          }
          this.totalCost = this.getTotalCost();
          this.reloadSaleDetail.next(true);
          this.reloadProducts.next(true);
        }
      });
    }
    this.totalCost = this.getTotalCost();
    this.reloadSaleDetail.next(true);
    this.reloadProducts.next(true);
  }



  groupProductsByCategory(stocks) {
    this.productsGroupedByCategory = stocks.reduce((p, n) => {
      if (!p[n.categoryName]) { p[n.categoryName] = []; }
      p[n.categoryName].push(n);
      return p;
    }, {});
    this.productsGroupedByCategory = Object.keys(this.productsGroupedByCategory).map(key => ({ name: key, value: this.productsGroupedByCategory[key] }));
  }
}

@Component({
  selector: 'app-edit-sale-dialog',
  templateUrl: './edit-sale-dialog.component.html',
  styleUrls: ['./edit-sale-dialog.component.scss']
})
export class EditSaleDetailDialogComponent {
  public displayError: boolean = false;
  @Input() public data: any;

  constructor(public activeModal: NgbActiveModal) { }

  selectPrice(price) {
    this.data.saleDetailUnitaryPrice = parseFloat(price);
  }

  onYesClick() {
    if (this.data.productStock < this.data.saleDetailQuantity && this.data.stockId != 0) {
      this.displayError = true;
    } else {
      this.activeModal.close(this.data);
    }
  }
}