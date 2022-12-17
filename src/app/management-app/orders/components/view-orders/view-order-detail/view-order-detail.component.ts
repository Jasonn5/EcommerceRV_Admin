import { DatePipe } from '@angular/common';
import { ApplicationRef, Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { SaleService } from 'src/app/management-app/sales/services/sale.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { OrderStatusEnum } from 'src/app/models/enums/order-status-enum';
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/order-detail';
import { localeEs } from 'src/assets/locale.es.js';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-view-order-detail',
  templateUrl: './view-order-detail.component.html',
  styleUrls: ['./view-order-detail.component.scss']
})
export class ViewOrderDetailComponent implements OnInit {
  @Input() public data: any;
  public order: Order;
  public orderDetails: OrderDetail[] = [];
  public gridOptions: GridOptions;
  public columnDefs;
  public totalCost;
  public closeOrder = OrderStatusEnum.COMPLETED;
  public cancelOrder = OrderStatusEnum.CANCELED;
  public modalOptions: NgbModalOptions;
  public saleDate: Date = new Date();
  public statusOrder: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService,
    private modalService: NgbModal,
    private toastrService: NbToastrService,
    private saleService: SaleService,
    private appRef: ApplicationRef,
    private pdfService: PdfService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.order = new Order();
    this.orderDetails = [];
    this.spinner.show();
    this.loadData();
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    }
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 20,
      onGridReady: (params) => {
        params.api.sizeColumnsToFit();
        params.api.collapseAll();
      },
      onGridSizeChanged: (params) => {
        params.api.collapseAll();
      },
      defaultColDef: {
        resizable: true
      },
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }

    this.columnDefs = [
      {
        headerName: 'Producto',
        valueFormatter: (params) => { return params.data.productName; },
        minWidth: 200
      },
      {
        headerName: 'Cantidad',
        valueFormatter: (params) => { return params.data.quantity; },
        minWidth: 100
      },
      {
        headerName: 'Precio unitario',
        valueFormatter: (params) => { return Number(params.data.unitaryPrice).toFixed(2) + " Bs."; },
        minWidth: 100
      },
      {
        headerName: 'Subtotal',
        valueFormatter: (params) => { return Number(params.data.totalPrice).toFixed(2) + " Bs."; },
        minWidth: 100
      }
    ];

    this.orderService.findById(this.data.orderId).subscribe(order => {
      this.order = order;
      this.orderDetails = this.order.orderDetails;
      this.totalCost = this.orderDetails.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
      this.statusOrder = this.order.statusId == OrderStatusEnum.PENDING;
      this.spinner.hide();
    });
  }

  closeOrders() {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = "¿Desea completar el pedido?";
    modalRef.componentInstance.title = "Finalizar pedido";
    this.appRef.tick();
    modalRef.result.then((result) => {
      if (result) {
        this.order.statusId = this.closeOrder;
        this.orderService.updateOrderStatus(this.order).subscribe(order => {
          this.toastrService.primary('Pedido actualizado', 'Éxito');
          this.saleService.printReceipt(order.sale.id, false).subscribe(pdf => {
            this.pdfService.Open(pdf);
          });
        },
          (error) => {
            this.toastrService.danger(error.error.message, 'Error');
          });
        this.activeModal.close(true);
      }
    });
  }

  cancelOrders() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = "¿Está seguro de cancelar el pedido?";
    modalRef.componentInstance.title = "Cancelar pedido";
    this.appRef.tick();
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        this.order.statusId = this.cancelOrder;
        this.orderService.updateOrderStatus(this.order).subscribe(() => {
          this.toastrService.primary('Pedido cancelado', 'Éxito');
          this.spinner.hide();
        },
          (error) => {
            this.toastrService.danger(error.error.message, 'Error');
            this.spinner.hide();
          });
        this.activeModal.close(true);
      }
    });
  }
}
