import { DatePipe } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { SaleConfigurationService } from 'src/app/management-app/admin/services/sale-configuration.service';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { SaleService } from 'src/app/management-app/sales/services/sale.service';
import { CashRegister } from 'src/app/models/cash-register';
import { OrderStatusEnum } from 'src/app/models/enums/order-status-enum';
import { Order } from 'src/app/models/order';
import { SaleConfiguration } from 'src/app/models/sale-configuration';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { OrderStatusPipe } from '../../pipes/order-status.pipe';
import { OrderService } from '../../services/order.service';
import { localeEs } from 'src/assets/locale.es.js';
import { ViewOrderDetailComponent } from './view-order-detail/view-order-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {
  public orderStatusId = OrderStatusEnum.PENDING;
  public pendingOrder = OrderStatusEnum.PENDING;
  public closeOrder = OrderStatusEnum.COMPLETED;
  public cancelOrder = OrderStatusEnum.CANCELED;
  public saleConfiguration: SaleConfiguration;
  public saleDate: Date = new Date();
  public columnDefs;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public orders: Order[] = [];
  public modalOptions: NgbModalOptions;
  public gridApi;
  public statusColum = true;
  public statusColumComplete = false;
  public dosage;
  public cashRegisterCode;
  public cashRegister: CashRegister;
  public isBillingUser: boolean;
  public startDate: NgbDate;
  public endDate: NgbDate;
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;
  public searchIsEmpty: boolean = true;
  public searchText: string = "";

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private saleConfigurationService: SaleConfigurationService,
    private orderStatusPipe: OrderStatusPipe,
    private datepipe: DatePipe,
    private modalService: NgbModal,
    private internetConnectionService: InternetConnectionService,
    private ngZone: NgZone,
    private router: Router,
    private calendar: NgbCalendar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.isBillingUser = this.authService.getRoles().includes('Billing')
    this.internetConnectionService.verifyInternetConnection();
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    };
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.startDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getUTCDate());
    this.endDate = this.calendar.getToday();
    this.loadData();
    this.saleConfigurationService.getConfiguration(this.authService.getUsername()).subscribe(configuration => {
      this.saleConfiguration = configuration;
      this.dosage = this.saleConfiguration.billConfiguration != null ? this.saleConfiguration.billConfiguration.name : 'NINGUNA';
      this.cashRegisterCode = this.saleConfiguration.cashRegister != null ? this.saleConfiguration.cashRegister.code : 'NINGUNA';
      this.cashRegister = this.saleConfiguration.cashRegister;
    });
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    }
    this.listOrders('');
    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.listOrders(text);
    });
  }

  listOrders(value) {
    this.spinner.show();
    let startDate = this.datepipe.transform(new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day), 'yyyy-MM-dd');
    let endDate = this.datepipe.transform(new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day), 'yyyy-MM-dd');
    this.orderService.listOrders(this.orderStatusId, 0, startDate, endDate, value).subscribe(orders => {
      this.orders = orders;
      this.searchIsEmpty = value == '';
      this.searchText = value;
      this.spinner.hide();
    });
    if (this.orderStatusId != 1) {
      this.statusColum = false;
    } else {
      this.statusColum = true;
    }
    if (this.orderStatusId == 2) {
      this.statusColumComplete = true;
    }

    if (this.gridApi) {
      this.loadData()
    }
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 20,
      onGridReady: (params) => {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
        params.api.collapseAll();
      },
      onGridSizeChanged: (params) => {
        params.api.sizeColumnsToFit();
        params.api.collapseAll();
      },
      defaultColDef: {
        resizable: true
      },
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }

    this.columnDefs = [
      {
        headerName: 'Código',
        valueFormatter: (params) => { return params.data.code; },
        minWidth: 80,
        width: 80
      },
      {
        headerName: 'Estado',
        valueFormatter: (params) => { return this.orderStatusPipe.transform(params.data.statusId); },
        minWidth: 100,
        width: 100
      },
      {
        headerName: '',
        valueFormatter: (params) => { return params.data.isDelivered ? 'Entregado' : 'No entregado'; },
        minWidth: 100,
        width: 100
      },
      {
        headerName: 'Cliente',
        valueFormatter: (params) => { return params.data.client.name; },
        minWidth: 200,
        width: 200
      },
      {
        headerName: 'Vendedor',
        valueFormatter: (params) => { return params.data.seller.name; },
        minWidth: 200,
        width: 200
      },
      {
        headerName: 'Fecha',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.orderDate, 'dd/MM/yyyy HH:mm:ss'); },
        minWidth: 150,
        width: 150
      },
      {
        headerName: 'Fecha Fin',
        valueFormatter: (params) => { return params.data.updateDate != null ? this.datepipe.transform(params.data.updateDate, 'dd/MM/yyyy HH:mm:ss') : ""; },
        hide: this.statusColum,
        condition: 'Complete',
        minWidth: 150,
        width: 150
      },
      {
        headerName: 'Monto total',
        valueFormatter: (params) => { return Number(this.getTotalCost(params.data.orderDetails)).toFixed(2) + " Bs." },
        minWidth: 110,
        width: 110
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.viewOrderDetail.bind(this),
          label: 'eye-outline',
          tooltip: 'Ver detalle del pédido',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.sendOrderId.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Editar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  getTotalCost(orderDetails) {
    var orderDetailList = [];
    orderDetailList = orderDetails;
    return orderDetailList.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
  }

  viewOrderDetail(order) {
    this.modalOptions.size = 'xl';
    const modalRef = this.modalService.open(ViewOrderDetailComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      orderId: order.rowData.id
    };
    modalRef.result.then((result) => {
      if (result) {
        setTimeout(() => { window.location.reload(); }, 500);
      }
    });
  }

  sendOrderId(e) {
    this.ngZone.run(() => this.router.navigate(['/orders/update-order', e.rowData.id])).then();
  }

  getTimeLapseBetweenDates(order: Order) {
    if (order.completedDate) {
      var endDate = new Date(order.completedDate);
      var startDate = new Date(order.orderDate);
      var diffMs = endDate.getTime() - startDate.getTime();
      var days = Math.floor(diffMs / 86400000);
      var hours = Math.floor((diffMs % 86400000) / 3600000);
      var minutes = Math.round(((diffMs % 86400000) % 3600000) / 60000);

      return days + " dias " + hours + " horas " + minutes + " minutos";
    } else {
      return "";
    }
  }
}
