import { DatePipe } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { Sale } from 'src/app/models/sale';
import { SaleDetail } from 'src/app/models/sale-detail';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { SaleService } from '../../services/sale.service';
import { localeEs } from 'src/assets/locale.es.js';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { ViewSaleDetailComponent } from './view-sale-detail/view-sale-detail.component';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrls: ['./view-sales.component.scss']
})
export class ViewSalesComponent implements OnInit {
  public sales: Sale[] = [];
  public saleDetails: SaleDetail[] = [];
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public columnDefs;
  public startDate: NgbDate;
  public endDate: NgbDate;
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;
  public searchIsEmpty: boolean = true;
  public searchText: string = "";
  public isBilling;

  constructor(
    private saleService: SaleService,
    private datepipe: DatePipe,
    private modalService: NgbModal,
    private internetConnectionService: InternetConnectionService,
    private toastrService: NbToastrService,
    private ngZone: NgZone,
    private router: Router,
    private calendar: NgbCalendar,
    private pdfService: PdfService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.isBilling =  this.authService.getRoles().includes('Billing');
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    };
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    }
    this.sales = [];
    this.saleDetails = [];
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.startDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getUTCDate());
    this.endDate = this.calendar.getToday();
    this.loadData();
    this.listSalesByDate('');
    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.listSalesByDate(text);
    });
  }

  listSalesByDate(value) {
    this.spinner.show();
    let startDate = this.datepipe.transform(new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day), 'yyyy-MM-dd');
    let endDate = this.datepipe.transform(new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day), 'yyyy-MM-dd');
    this.saleService.listSales(value, startDate, endDate).subscribe(sales => {
      this.sales = sales;
      this.searchIsEmpty = value == '';
      this.searchText = value;
      this.spinner.hide();
    });
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
        headerName: 'Código',
        valueFormatter: (params) => { return params.data.code; },
        minWidth: 80
      },
      {
        headerName: 'Cliente',
        valueFormatter: (params) => { return params.data.client != null ? params.data.client.name : "SIN NOMBRE"; },
        minWidth: 180
      },
      {
        headerName: 'Descripción',
        valueFormatter: (params) => { return params.data.description; },
        minWidth: 250
      },
      {
        headerName: 'Fecha',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.date, 'dd/MM/yyyy HH:mm:ss') },
        minWidth: 150
      },
      {
        headerName: 'Monto total',
        valueFormatter: (params) => { return Number(this.getTotalCost(params.data.saleDetails)).toFixed(2) + " Bs." },
        minWidth: 100
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.viewSaleDetail.bind(this),
          label: 'eye-outline',
          tooltip: 'Ver detalle de venta',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.sendSaleId.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Editar',
          alwaysDisplayIcon: false,
          checkValueToDisplay: false,
          statusValue: 'statusId'
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.generateReceipCopy.bind(this),
          label: 'file-outline',
          tooltip: 'Generar nota de venta',
          alwaysDisplayIcon: false,
          checkValueToDisplay: false,
          statusValue: 'statusId'
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.viewBills.bind(this),
          label: 'file-text-outline',
          tooltip: 'Ver facturas',
          alwaysDisplayIcon: false,
          checkValueToDisplay: false,
          statusValue: 'statusId'
        },
        width: 60,
        minWidth: 60,
        hide: !this.isBilling
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.cancelSale.bind(this),
          label: 'close-square-outline',
          tooltip: 'Cancelar venta',
          alwaysDisplayIcon: false,
          checkValueToDisplay: false,
          statusValue: 'statusId'
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  getTotalCost(saleDetails) {
    var saleDetailList = [];
    saleDetailList = saleDetails;
    return saleDetailList.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
  }

  viewSaleDetail(sale) {
    this.modalOptions.size = 'xl';
    const modalRef = this.modalService.open(ViewSaleDetailComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      saleId: sale.rowData.id
    };
  }

  cancelSale(sale) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Cancelar venta';
    modalRef.componentInstance.message = '¿ESTA SEGURO DE CANCELAR LA VENTA?, TOMAR EN CUENTA QUE UNA VEZ CANCELADA EL PROCESO NO SE PUEDE REVERTIR, TODOS LOS CREDITOS Y PAGOS ASOCIADOS SERAN ELIMINADOS';
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        this.saleService.cancelSale(sale.rowData).subscribe(() => {
          this.toastrService.primary('Venta cancelada', 'Éxito');
          this.spinner.hide();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
      }
    });
  }

  sendSaleId(e) {
    this.ngZone.run(() => this.router.navigate(['/sales/update-sale', e.rowData.id])).then();
  }

  generateReceipCopy(sale) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Generar nota de venta';
    modalRef.componentInstance.message = '¿Desea generar nota de venta?';
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        this.saleService.printReceipt(sale.rowData.id, false).subscribe(pdf => {
          this.pdfService.Open(pdf);
          this.spinner.hide();
        });
      }
    });
  }

  viewBills(sale) {
    this.ngZone.run(() => this.router.navigate(['/billing/add-bill', sale.rowData.id])).then();
  }
}
