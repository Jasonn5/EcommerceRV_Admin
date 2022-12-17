import { DatePipe } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate, NgbDatepickerConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { BusinessServiceService } from 'src/app/management-app/business-services/services/business-service.service';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { StockService } from 'src/app/management-app/products/services/stock.service';
import { SellerService } from 'src/app/management-app/sellers/services/seller.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { BusinessService } from 'src/app/models/business-service';
import { Client } from 'src/app/models/client';
import { Credit } from 'src/app/models/credit';
import { Sale } from 'src/app/models/sale';
import { SaleDetail } from 'src/app/models/sale-detail';
import { Seller } from 'src/app/models/seller';
import { Stock } from 'src/app/models/stock';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { SaleService } from '../../services/sale.service';
import { EditSaleDetailDialogComponent } from '../add-sale/add-sale.component';

@Component({
  selector: 'app-update-sale',
  templateUrl: './update-sale.component.html',
  styleUrls: ['./update-sale.component.scss']
})
export class UpdateSaleComponent implements OnInit {
  public stocks: Stock[] = [];
  public businessServices: BusinessService[] = [];
  public searchProductsIsEmpty: boolean = true;
  public searchServicesIsEmpty: boolean = true;
  public sale: Sale;
  public credit: Credit;
  public currentCredit: Credit;
  public isCredit: boolean = false;
  public creditDays: number = 1;
  public saleDetails: SaleDetail[] = [];
  private saleDetailId: number;
  public modalOptions: NgbModalOptions;
  public totalCost = 0;
  public reloadSaleDetail: Subject<boolean> = new Subject<boolean>();
  public reloadProducts: Subject<boolean> = new Subject<boolean>();
  @ViewChild('searchProduct', { static: true }) searchProduct: ElementRef;
  @ViewChild('searchService', { static: true }) searchService: ElementRef;
  public sellers: Seller[] = [];
  public selectedSeller: Seller = new Seller();
  public sellerId: number = 0;
  public selectedClient: Client = new Client();
  public isFromSale: boolean = true;
  public saleDate: NgbDate;
  public activeId = 1;
  public isAdmin: boolean;

  constructor(
    private saleService: SaleService,
    private stockService: StockService,
    private businessServiceService: BusinessServiceService,
    private internetConnectionService: InternetConnectionService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastrService: NbToastrService,
    private sellerService: SellerService,
    private ngZone: NgZone,
    private router: Router,
    private config: NgbDatepickerConfig,
    private calendar: NgbCalendar,
    private datepipe: DatePipe,
    private pdfService: PdfService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.isAdmin =  this.authService.getRoles().includes('Admin');
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      centered: true
    }
    const currentDate = new Date();
    this.config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() }
    this.sale = new Sale();
    this.credit = new Credit();
    this.currentCredit = new Credit();
    this.saleDetails = [];
    this.saleDetailId = 0;
    this.sellerService.listSellers('').subscribe(sellers => {
      this.sellers = sellers;
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.saleService.findById(params['id']).subscribe(sale => {
          this.sale = sale;
          this.saleDate = this.calendar.getToday();
          var date = new Date(this.sale.date);
          this.saleDate.year = date.getFullYear();
          this.saleDate.month = date.getMonth() + 1;
          this.saleDate.day = date.getUTCDate();
          var noClient = new Client;
          noClient.id = 0;
          noClient.name = "S/N";
          noClient.nit = 0;
          this.currentCredit = this.sale.credit ? this.sale.credit : null;
          this.credit = this.sale.credit ? this.sale.credit : null;
          this.isCredit = this.sale.credit ? true : false;
          this.creditDays = this.sale.credit ? this.sale.credit.creditDays : 1;
          this.selectedSeller = this.sale.seller ? this.sale.seller : null;
          this.sellerId = this.sale.seller ? this.sale.seller.id : 0;
          this.selectedClient = this.sale.client ? this.sale.client : noClient;
          this.saleDetails = this.sale.saleDetails;
          this.reloadSaleDetail.next(true);
          this.totalCost = this.getTotalCost();
        });
      }
    });
    this.searchProducts('');
    this.searchServices('');
    fromEvent(this.searchProduct.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchProducts(text);
    });

    fromEvent(this.searchService.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchServices(text);
    });
  }

  changeTab(tabId) {
    this.activeId = tabId;
  }

  getTotalCost() {
    return this.saleDetails.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
  }

  selectSeller() {
    this.selectedSeller = this.sellerId != 0 ? this.sellers.find(s => s.id == this.sellerId) : null;
  }

  selectClient(client: Client) {
    this.selectedClient = client;
  }

  paymentType(event: boolean) {
    if (event) {
      if (this.currentCredit != null) {
        this.credit = this.currentCredit;
      } else {
        this.credit = new Credit();
        //@ts-ignore
        this.credit.id = -1;
        this.credit.paidAmount = 0;
      }
    } else {
      this.credit = null;
    }

    this.isCredit = event;
  }

  searchProducts(value: string) {
    this.spinner.show();
    this.stockService.searchStocks(value).subscribe(stocks => {
      this.saleDetails.forEach(sd => {
        var stock = stocks.find(s => s.id == sd.stockId);
        if (stock && sd.id < 0) {
          stock.quantity -= sd.quantity;
        }
        if (stock && sd.id > 0 && sd.stockQuantity >= 0) {
          stock.quantity = sd.stockQuantity;
        }
      });
      this.stocks = stocks;
      this.searchProductsIsEmpty = value == '';
      this.spinner.hide();
    });
  }

  searchServices(value: string) {
    this.spinner.show();
    this.businessServiceService.searchBusinessServices(value).subscribe(businessServices => {
      this.businessServices = businessServices;
      this.searchServicesIsEmpty = value == '';
      this.spinner.hide();
    });
  }

  addProductToSaleDetail(stock: Stock) {
    if (stock.quantity > 0) {
      var newSaleDetail = new SaleDetail();
      newSaleDetail.priceList = [];
      newSaleDetail.stockId = stock.id;
      newSaleDetail.productName = stock.product.displayName;
      newSaleDetail.locationName = stock.location.name;
      newSaleDetail.quantity = 1;
      newSaleDetail.unitaryPrice = stock.product.price;
      newSaleDetail.totalPrice = stock.product.price;
      stock.product.price != 0 ? newSaleDetail.priceList.push(stock.product.price) : null;
      stock.product.priceB != 0 ? newSaleDetail.priceList.push(stock.product.priceB) : null;
      stock.product.priceC != 0 ? newSaleDetail.priceList.push(stock.product.priceC) : null;
      stock.product.priceD != 0 ? newSaleDetail.priceList.push(stock.product.priceD) : null;
      stock.product.priceE != 0 ? newSaleDetail.priceList.push(stock.product.priceE) : null;
      this.saleDetailId--;
      //@ts-ignore
      newSaleDetail.id = this.saleDetailId;
      this.editSaleDetail(newSaleDetail);
    }
  }

  addBusinessServiceToSaleDetail(businessService: BusinessService) {
    var newSaleDetail = new SaleDetail();
    newSaleDetail.priceList = [];
    newSaleDetail.stockId = 0;
    newSaleDetail.businessServiceId = businessService.id;
    newSaleDetail.productName = businessService.businessServiceName;
    newSaleDetail.quantity = 1;
    newSaleDetail.unitaryPrice = businessService.price;
    newSaleDetail.totalPrice = businessService.price;
    this.saleDetailId--;
    newSaleDetail.id = this.saleDetailId;
    this.editSaleDetail(newSaleDetail);
  }

  updateSale() {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Venta';
    modalRef.componentInstance.message = '¿Desea actualizar la venta?';
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        if (this.credit != null) {
          this.credit.creditDays = this.creditDays;
        }
        var date = new Date(this.saleDate.year, this.saleDate.month - 1, this.saleDate.day, 0, 0, 0);
        this.sale.date = date; //this.datepipe.transform(date, "yyyy-MM-dd");
        this.saleService.updateSale(this.sale, this.saleDetails, this.selectedClient, this.credit, this.selectedSeller).subscribe(sale => {
          this.toastrService.primary('Venta actualizada', 'Éxito', {});
          this.saleService.printReceipt(this.sale.id, false).subscribe(pdf => {
            this.pdfService.Open(pdf);
            this.spinner.hide();
            window.location.reload();
            this.ngZone.run(() => this.router.navigate(['/sales/view-sales'])).then();
          });
        },
          (error) => {
            this.toastrService.danger(error.error.message, 'Error');
            this.spinner.hide();
          });
      }
    });
  }

  editSaleDetail(saleDetail: SaleDetail) {
    this.modalOptions.size = 'md';
    var stock = this.stocks.find(s => s.id == saleDetail.stockId);
    var sd = this.saleDetails.find(sd => sd.id == saleDetail.id);
    var priceList = saleDetail.id < 0 ? saleDetail.priceList : this.getPriceList(saleDetail);
    if (!saleDetail.stockQuantity && saleDetail.id > 0) {
      saleDetail.stockQuantity = this.getStockQuantity(saleDetail);
    }
    const modalRef = this.modalService.open(EditSaleDetailDialogComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      saleDetailUnitaryPrice: saleDetail.unitaryPrice,
      saleDetailQuantity: saleDetail.quantity,
      productStock: stock ? sd ? stock.quantity + saleDetail.quantity : stock.quantity : saleDetail.stockQuantity + saleDetail.quantity,
      priceList: priceList,
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

  getPriceList(saleDetail: SaleDetail) {
    var priceList = []

    if (saleDetail.stockId != 0) {
      this.stockService.findById(saleDetail.stockId).subscribe(stock => {
        stock.product.price != 0 ? priceList.push(stock.product.price) : null;
        stock.product.priceB != 0 ? priceList.push(stock.product.priceB) : null;
        stock.product.priceC != 0 ? priceList.push(stock.product.priceC) : null;
        stock.product.priceD != 0 ? priceList.push(stock.product.priceD) : null;
        stock.product.priceE != 0 ? priceList.push(stock.product.priceE) : null;
      });
    }

    return priceList;
  }

  getStockQuantity(saleDetail: SaleDetail) {
    var stockQuantity = 0;

    if (saleDetail.stockId != 0) {
      this.stockService.findById(saleDetail.stockId).subscribe(stock => {
        stockQuantity = stock.quantity;
      });
    }

    return stockQuantity;
  }
}
