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
import { BusinessService } from 'src/app/models/business-service'
import { BusinessServiceService } from 'src/app/management-app/business-services/services/business-service.service'
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
  public businessServices: BusinessService[] = [];
  public saleDetails: SaleDetail[] = [];
  private saleDetailId: number;
  public client: Client;
  public cashRegister: CashRegister;
  public saleConfiguration: SaleConfiguration;
  public billConfiguration: BillConfiguration;
  public locationId;
  public searchProductsIsEmpty: boolean = true;
  public searchServicesIsEmpty: boolean = true;
  @ViewChild('searchProduct', { static: true }) searchProduct: ElementRef;
  @ViewChild('searchService', { static: true }) searchService: ElementRef;
  public saleDate: NgbDate;
  public reloadSaleDetail: Subject<boolean> = new Subject<boolean>();
  public reloadProducts: Subject<boolean> = new Subject<boolean>();
  public modalOptions: NgbModalOptions;
  public totalCost = 0;
  public credit: Credit = null;
  public isCredit: boolean = false;
  public creditDays: number = 1;
  public registerClient: boolean = false;
  public isFromSale: boolean = true;
  public saleCode;
  public cashRegisterName;
  public locationName;
  public sellers: Seller[] = [];
  public selectedSeller: Seller;
  public sellerId: number = 0;
  public activeNotifications: boolean;
  public activeId = 1;
  public isAdmin: boolean;

  constructor(
    private saleService: SaleService,
    private toastrService: NbToastrService,
    private saleConfigurationService: SaleConfigurationService,
    private clientsService: ClientService,
    private stockService: StockService,
    private sellerService: SellerService,
    private authService: AuthService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    private datepipe: DatePipe,
    private businessServiceService: BusinessServiceService,
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
    this.saleConfiguration = new SaleConfiguration();
    this.client = new Client;
    this.saleCode = new Sale();
    this.client.id = 0;
    this.client.nit = 0;
    this.client.name = 'S/N';
    this.saleDetailId = 0;
    this.saleDetails = [];
    this.saleDate = this.calendar.getToday();
    const currentDate = new Date();
    this.config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() }
    this.selectedSeller = null;
    this.sellerService.listSellers('').subscribe(sellers => {
      this.sellers = sellers;
    });
    this.saleConfigurationService.getConfiguration(this.authService.getUsername()).subscribe(configuration => {
      this.saleConfiguration = configuration;
      this.cashRegisterName = this.saleConfiguration.cashRegister != null ? this.saleConfiguration.cashRegister.code : 'NINGUNA';
      this.locationName = this.saleConfiguration.location != null ? this.saleConfiguration.location.name : 'TODAS';
      this.locationId = this.saleConfiguration.location != null ? this.saleConfiguration.location.id : 0;
      this.cashRegister = this.saleConfiguration.cashRegister != null ? this.saleConfiguration.cashRegister : null;
      this.searchProducts('');
      this.searchServices('');
    });
    this.getSaleCode();
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

  getSaleCode() {
    var date = this.datepipe.transform(new Date(this.saleDate.year, this.saleDate.month - 1, this.saleDate.day, 0, 0, 0), 'yyyy-MM-dd');
    this.saleService.getSaleCode(date).subscribe(sale => {
      this.saleCode = sale;
    });
  }

  selectSeller() {
    this.selectedSeller = this.sellerId != 0 ? this.sellers.find(s => s.id == this.sellerId) : null;
  }

  paymentType(event: boolean) {
    if (event) {
      this.credit = new Credit();
      //@ts-ignore
      this.credit.id = -1;
      this.credit.paidAmount = 0;
    } else {
      this.credit = null;
    }

    this.isCredit = event;
  }

  searchProducts(value: string) {
    this.spinner.show();
    if (this.locationId) {
      this.stockService.getStocksByLocation(value, this.locationId).subscribe(stocks => {
        this.saleDetails.forEach(sd => {
          var stock = stocks.find(s => s.id == sd.stockId);
          if (stock) {
            stock.quantity -= sd.quantity;
          }
        });
        this.stocks = stocks;
        this.searchProductsIsEmpty = value == '';
        this.activeId = this.stocks.length == 0 && this.searchProductsIsEmpty ? 2 : 1;
        if (this.saleConfiguration.listByCategory) {
          this.groupProductsByCategory(this.stocks);
        }
        this.spinner.hide();
      });
    } else {
      this.stockService.searchStocks(value).subscribe(stocks => {
        this.saleDetails.forEach(sd => {
          var stock = stocks.find(s => s.id == sd.stockId);
          if (stock) {
            stock.quantity -= sd.quantity;
          }
        });
        this.stocks = stocks;
        this.searchProductsIsEmpty = value == '';
        this.activeId = this.stocks.length == 0 && this.searchProductsIsEmpty ? 2 : 1;
        if (this.saleConfiguration.listByCategory) {
          this.groupProductsByCategory(this.stocks);
        }
        this.spinner.hide();
      });
    }
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
      newSaleDetail.businessServiceId = 0;
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
      this.saleDetailId++;
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
    this.saleDetailId++;
    newSaleDetail.id = this.saleDetailId;
    this.editSaleDetail(newSaleDetail);
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
        if (this.credit != null) {
          this.credit.creditDays = this.creditDays;
        }
        var date = new Date(this.saleDate.year, this.saleDate.month - 1, this.saleDate.day, 0, 0, 0);
        var saleDate = this.datepipe.transform(date, "yyyy-MM-dd");
        this.saleService.addSale(this.saleDetails, this.client, saleDate, this.credit, this.selectedSeller).subscribe(sale => {
          this.toastrService.primary('Venta registrada', 'Éxito', {});
          this.saleDetails = [];
          this.client = new Client;
          this.client.id = 0;
          this.client.nit = 0;
          this.client.name = 'S/N';
          this.saleDate = this.calendar.getToday();
          this.totalCost = 0;
          this.creditDays = 1;
          this.isCredit = false;
          this.credit = null;
          this.selectedSeller = null;
          this.sellerId = 0;
          this.getSaleCode();
          this.notificationService.verifyActiveNotifications().subscribe(result => {
            if (result) {
              this.sharedService.verifyActiveNotifications(true);
            }
          });
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

  optionsToGetClient(option) {
    if (option == 1) {
      this.client = new Client;
      this.client.id = 0;
      this.client.nit = 0;
      this.client.name = 'S/N';
    }
    if (option == 2) {
      this.client = new Client;
    }
    if (option == 3) {
      this.registerClient = false;
      this.client = new Client;
      this.client.nit = 0;
      this.client.businessName = '';
    }
  }

  selectClient(client: Client) {
    this.client = client;
  }

  searchClientById(id) {
    this.clientsService.findClientById(id).subscribe(client => {
      this.client = client;
    });
  }

  addClient() {
    this.spinner.show();
    var client = {
      name: this.client.name,
      nit: this.client.nit,
      businessName: this.client.businessName,
      latitude: "-17.372752",
      longitude: "-66.159048"
    }
    this.clientsService.addClient(client).subscribe(client => {
      this.toastrService.primary('Cliente registrado', 'Éxito');
      this.registerClient = true;
      this.searchClientById(client.id);
      this.spinner.hide();
    });
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