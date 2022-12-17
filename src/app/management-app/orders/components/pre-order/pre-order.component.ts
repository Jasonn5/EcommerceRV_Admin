import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Stock } from 'src/app/models/stock';
import { OrderDetail } from 'src/app/models/order-detail'
import { fromEvent, Subject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators'
import { DatePipe } from '@angular/common';
import { Client } from 'src/app/models/client';
import { NgbModalOptions, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { StockService } from 'src/app/management-app/products/services/stock.service';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { OrderService } from '../../services/order.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pre-order',
  templateUrl: './pre-order.component.html',
  styleUrls: ['./pre-order.component.scss']
})
export class PreOrderComponent implements OnInit {
  public client: Client;
  public stocks: Stock[] = [];
  public searchStockIsEmpty: boolean = true;
  @ViewChild('searchStock', { static: true }) searchStock: ElementRef;
  public orderDetails: OrderDetail[] = [];
  public orderDetailId: number;
  public modalOptions: NgbModalOptions;
  public reloadOrderDetail: Subject<boolean> = new Subject<boolean>();
  public totalCost = 0;
  public preOrderDate: Date = new Date();
  private pipe = new DatePipe('en-US');

  constructor(
    private stockService: StockService,
    private modalService: NgbModal,
    private orderService: OrderService,
    private pdfService: PdfService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.internetConnectionService.verifyInternetConnection();
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      centered: true
    }
    this.orderDetails = [];
    this.orderDetailId = 0;
    this.client = new Client();
    this.client.name = "";
    this.searchStocks('');
    fromEvent(this.searchStock.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchStocks(text);
    });
  }

  generatePreOrder() {
    this.spinner.show();
    this.orderService.generatePreOrder(this.orderDetails, this.client).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.orderDetails = [];
      this.client = new Client();
      this.totalCost = 0;
      this.reloadOrderDetail.next(true);
      this.spinner.hide();
    });
  }

  searchStocks(value: string) {
    this.spinner.show();
    this.stockService.searchStocks(value).subscribe(stocks => {
      this.stocks = stocks;
      this.searchStockIsEmpty = value == '';
      this.spinner.hide();
    });
  }

  addProductToPreOrder(stock) {
    var orderDetail = this.orderDetails.find(od => od.stockId == stock.id);
    var discount = stock.product.discount;
    if (orderDetail) {
      orderDetail.quantity++;
      orderDetail.totalPrice = orderDetail.quantity * orderDetail.unitaryPrice;
    } else {
      var newOrderDetail = new OrderDetail();
      newOrderDetail.stockId = stock.id;
      newOrderDetail.productName = stock.product.name;
      newOrderDetail.quantity = 1;
      if (discount != 0) {
        var priceWithDiscount = stock.product.price - ((stock.product.price * discount) / 100);
        newOrderDetail.unitaryPrice = priceWithDiscount;
        newOrderDetail.totalPrice = priceWithDiscount;
      } else {
        newOrderDetail.unitaryPrice = stock.product.price;
        newOrderDetail.totalPrice = stock.product.price;
      }
      this.orderDetailId++;
      newOrderDetail.id = this.orderDetailId;
      this.orderDetails.push(newOrderDetail);
    }
    this.totalCost = this.getTotalCost();
    this.reloadOrderDetail.next(true);
  }

  getTotalCost() {
    return this.orderDetails.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
  }

  removeOrderDetail(orderDetail) {
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
      }
    });
  }

  editOrderDetail(orderDetail) {
    this.modalOptions.size = 'md';
    const modalRef = this.modalService.open(EditPreOrderDetailDialogComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      orderDetailUnitaryPrice: orderDetail.unitaryPrice,
      orderDetailQuantity: orderDetail.quantity
    };
    modalRef.result.then((result) => {
      if (result) {
        orderDetail.totalPrice = result.orderDetailQuantity * result.orderDetailUnitaryPrice;
        orderDetail.unitaryPrice = result.orderDetailUnitaryPrice;
        orderDetail.quantity = result.orderDetailQuantity;
        this.totalCost = this.getTotalCost();
        this.reloadOrderDetail.next(true);
      }
    });
  }
}

@Component({
  selector: 'app-editOrderDetail-dialog',
  templateUrl: './edit-pre-order-detail-dialog.component.html',
})
export class EditPreOrderDetailDialogComponent {
  @Input() public data: any;

  constructor(public activeModal: NgbActiveModal) { }

  onYesClick() {
    this.activeModal.close(this.data);
  }
}

