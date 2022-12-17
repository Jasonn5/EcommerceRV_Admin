import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ClientService } from 'src/app/management-app/clients/services/client.service';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { StockService } from 'src/app/management-app/products/services/stock.service';
import { SellerService } from 'src/app/management-app/sellers/services/seller.service';
import { Client } from 'src/app/models/client';
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/order-detail';
import { Seller } from 'src/app/models/seller';
import { Stock } from 'src/app/models/stock';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
  public selectedClient: Client;
  public selectedSeller: Seller;
  public client: Client;
  public order: Order;
  public clients: Client[] = [];
  public sellers: Seller[] = [];
  public searchClientIsEmpty: boolean = true;
  @ViewChild('searchClient', { static: true }) searchClient: ElementRef;
  public stocks: Stock[] = [];
  public searchStockIsEmpty: boolean = true;
  @ViewChild('searchStock', { static: true }) searchStock: ElementRef;
  public orderDetails: OrderDetail[] = [];
  public orderDetailId: number;
  public modalOptions: NgbModalOptions;
  public reloadOrderDetail: Subject<boolean> = new Subject<boolean>();
  public reloadProducts: Subject<boolean> = new Subject<boolean>();
  public totalCost = 0;
  public sellerId: number = 0;
  public isFromSale: boolean = true;
  public isSaleInCash: boolean = true;
  public creditDays: number = 0;

  constructor(
    private stockService: StockService,
    private orderService: OrderService,
    private toastrService: NbToastrService,
    private modalService: NgbModal,
    private sellerService: SellerService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      centered: true
    }
    this.selectedClient = new Client;
    this.selectedClient.id = 0;
    this.order = new Order;
    this.orderDetails = [];
    this.orderDetailId = 0;
    this.searchStocks('');

    fromEvent(this.searchStock.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchStocks(text);
    });
    this.sellerService.listSellers('').subscribe(sellers => {
      this.sellers = sellers;
    });
  }

  addOrder() {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Pedido';
    modalRef.componentInstance.message = '¿Desea registrar el pedido?';
    this.order.saleInCash = this.isSaleInCash;
    this.order.creditDays = this.creditDays
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        this.orderService.addOrder(this.order, this.orderDetails, this.selectedClient, this.selectedSeller).subscribe(() => {
          this.toastrService.primary('Pedido registrado', 'Éxito');
          this.orderDetails = [];
          this.client = new Client;
          this.client.id = 0;
          this.isSaleInCash = true;
          this.selectedClient = new Client;
          this.selectedClient.id = 0;
          this.selectedSeller = null;
          this.sellerId = 0;
          this.totalCost = 0;
          this.spinner.hide();
        });
      }
    });
  }

  addClientToOrder(client: Client) {
    if (client != null) {
      this.selectedClient = client;
    }
  }

  searchStocks(value: string) {
    this.spinner.show();
    this.stockService.searchStocks(value).subscribe(stocks => {
      this.stocks = stocks;
      this.searchStockIsEmpty = value == '';
      this.spinner.hide();
    });
  }

  selectSeller() {
    this.selectedSeller = this.sellerId != 0 ? this.sellers.find(s => s.id == this.sellerId) : null;
  }

  paymentType(event: boolean) {
    this.isSaleInCash = event;
  }

  addProductToOrderDetail(stock: Stock) {
    var newOrderDetail = new OrderDetail();
    newOrderDetail.priceList = [];
    newOrderDetail.stockId = stock.id;
    newOrderDetail.productName = stock.product.displayName;
    newOrderDetail.locationName = stock.location.name;
    newOrderDetail.quantity = 1;
    newOrderDetail.unitaryPrice = stock.product.price;
    newOrderDetail.totalPrice = stock.product.price;
    stock.product.price != 0 ? newOrderDetail.priceList.push(stock.product.price) : null;
    stock.product.priceB != 0 ? newOrderDetail.priceList.push(stock.product.priceB) : null;
    stock.product.priceC != 0 ? newOrderDetail.priceList.push(stock.product.priceC) : null;
    stock.product.priceD != 0 ? newOrderDetail.priceList.push(stock.product.priceD) : null;
    stock.product.priceE != 0 ? newOrderDetail.priceList.push(stock.product.priceE) : null;
    this.orderDetailId++;
    //@ts-ignore
    newOrderDetail.id = this.orderDetailId;
    this.editOrderDetail(newOrderDetail);
  }

  getTotalCost() {
    return this.orderDetails.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
  }

  editOrderDetail(orderDetail: OrderDetail) {
    this.modalOptions.size = 'md';
    var stock = this.stocks.find(s => s.id == orderDetail.stockId);
    var ord = this.orderDetails.find(sd => sd.id == orderDetail.id);
    const modalRef = this.modalService.open(EditOrderDetailDialogComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      orderDetailUnitaryPrice: orderDetail.unitaryPrice,
      orderDetailQuantity: orderDetail.quantity,
      priceList: orderDetail.priceList
    };
    modalRef.result.then((result) => {
      if (result) {
        orderDetail.totalPrice = result.orderDetailQuantity * result.orderDetailUnitaryPrice;
        orderDetail.unitaryPrice = result.orderDetailUnitaryPrice;
        orderDetail.quantity = result.orderDetailQuantity;
        if (!ord) {
          this.orderDetails.push(orderDetail);
        }
        this.totalCost = this.getTotalCost();
        this.reloadOrderDetail.next(true);
        this.reloadProducts.next(true);
      }
    });
    this.totalCost = this.getTotalCost();
    this.reloadOrderDetail.next(true);
    this.reloadProducts.next(true);
  }

  removeOrderDetail(orderDetail: OrderDetail) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Remover producto';
    modalRef.componentInstance.message = '¿Desea remover el producto ' + orderDetail.productName + '?';
    modalRef.result.then((result) => {
      if (result) {
        var index = this.orderDetails.indexOf(orderDetail);
        if (index > -1) {
          this.orderDetails.splice(index, 1);
        }
        this.totalCost = this.getTotalCost();
        this.reloadOrderDetail.next(true);
        this.reloadProducts.next(true);
      }
    });
    this.totalCost = this.getTotalCost();
    this.reloadOrderDetail.next(true);
    this.reloadProducts.next(true);
  }
}

@Component({
  selector: 'app-editOrderDetail-dialog',
  templateUrl: './edit-order-detail-dialog.component.html',
})
export class EditOrderDetailDialogComponent {
  @Input() public data: any;

  constructor(public activeModal: NgbActiveModal) { }

  selectPrice(price) {
    this.data.orderDetailUnitaryPrice = parseFloat(price);
  }

  onYesClick() {
    this.activeModal.close(this.data);
  }
}
