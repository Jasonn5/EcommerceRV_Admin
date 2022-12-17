import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
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
import { EditOrderDetailDialogComponent } from '../add-order/add-order.component';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.scss']
})
export class UpdateOrderComponent implements OnInit {
  public selectedClient: Client = new Client();
  public selectedSeller: Seller = new Seller();
  public clients: Client[] = [];
  public sellers: Seller[] = [];
  public order: Order = new Order();
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
  public orderCode;
  public orderDate;
  public isSaleInCash: boolean = true;
  public creditDays: number = 0;
  public isDelivered: boolean = false;

  constructor(
    private stockService: StockService,
    private orderService: OrderService,
    private toastrService: NbToastrService,
    private datepipe: DatePipe,
    private modalService: NgbModal,
    private sellerService: SellerService,
    private internetConnectionService: InternetConnectionService,
    private route: ActivatedRoute,
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
    this.orderDetails = [];
    this.orderDetailId = 0;
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderService.findById(params['id']).subscribe(order => {
          this.order = order;
          var noClient = new Client;
          noClient.name = "S/N";
          noClient.nit = 0;
          this.creditDays = this.order.creditDays;
          this.isSaleInCash = this.order.saleInCash;
          this.isDelivered = this.order.isDelivered;
          this.orderCode = this.order.code;
          this.orderDate = this.datepipe.transform(this.order.orderDate, 'dd/MM/yyyy');
          this.selectedSeller = this.order.seller != null ? this.order.seller : new Seller();
          this.sellerId = this.order.seller != null ? this.order.seller.id : 0;
          this.selectedClient = this.order.client != null ? this.order.client : noClient;
          this.orderDetails = this.order.orderDetails;
          this.reloadOrderDetail.next(true);
          this.totalCost = this.getTotalCost();
        });
      }
    });
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

  updateOrder() {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Pedido';
    modalRef.componentInstance.message = '¿Desea actualizar el pedido?';
    this.order.isDelivered = this.isDelivered;
    this.order.saleInCash = this.isSaleInCash;
    this.order.creditDays = this.isSaleInCash == true ? 0 : this.creditDays;
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        this.orderService.updateOrder(this.order, this.orderDetails, this.selectedClient, this.selectedSeller).subscribe(() => {
          this.toastrService.primary('Pedido actualizado', 'Éxito');
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
    this.orderDetailId--;
    //@ts-ignore
    newOrderDetail.id = this.orderDetailId;
    this.editOrderDetail(newOrderDetail);
  }

  getTotalCost() {
    return this.orderDetails.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
  }

  paymentType(event: boolean) {
    this.isSaleInCash = event;
  }

  editOrderDetail(orderDetail: OrderDetail) {
    this.modalOptions.size = 'md';
    var stock = this.stocks.find(s => s.id == orderDetail.stockId);
    var ord = this.orderDetails.find(sd => sd.id == orderDetail.id);
    var priceList = orderDetail.id < 0 ? orderDetail.priceList : this.getPriceList(orderDetail);
    const modalRef = this.modalService.open(EditOrderDetailDialogComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      orderDetailUnitaryPrice: orderDetail.unitaryPrice,
      orderDetailQuantity: orderDetail.quantity,
      priceList: priceList
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
    this.reloadOrderDetail.next(true);
    this.reloadProducts.next(true);
  }

  getPriceList(orderDetail: OrderDetail) {
    var priceList = []

    this.stockService.findById(orderDetail.stockId).subscribe(stock => {
      stock.product.price != 0 ? priceList.push(stock.product.price) : null;
      stock.product.priceB != 0 ? priceList.push(stock.product.priceB) : null;
      stock.product.priceC != 0 ? priceList.push(stock.product.priceC) : null;
      stock.product.priceD != 0 ? priceList.push(stock.product.priceD) : null;
      stock.product.priceE != 0 ? priceList.push(stock.product.priceE) : null;
    });

    return priceList;
  }
}
