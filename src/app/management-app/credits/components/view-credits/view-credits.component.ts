import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDatepickerConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { Credit } from 'src/app/models/credit';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { CreditService } from '../../services/credit.service';
import { PaymentService } from '../../services/payment.service';
import { localeEs } from 'src/assets/locale.es.js';
import { Client } from 'src/app/models/client';
import { ViewPaymentsComponent } from '../view-payments/view-payments.component';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaleConfigurationService } from 'src/app/management-app/admin/services/sale-configuration.service';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Component({
  selector: 'app-view-credits',
  templateUrl: './view-credits.component.html',
  styleUrls: ['./view-credits.component.scss']
})
export class ViewCreditsComponent implements OnInit {
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;
  public searchIsEmpty: boolean = true;
  public credits: Credit[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public lastTextSearch: string;
  public creditStatus = 0;
  public cashRegisterName;

  constructor(
    private creditService: CreditService,
    private paymentService: PaymentService,
    private internetConnectionService: InternetConnectionService,
    private datepipe: DatePipe,
    private modalService: NgbModal,
    private pdfService: PdfService,
    private toastrService: NbToastrService,
    private spinner: NgxSpinnerService,    
    private saleConfigurationService: SaleConfigurationService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      centered: true
    }
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    };
    this.loadData();
    this.searchCredits('');
    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchCredits(text);
    });

    this.saleConfigurationService.getConfiguration(this.authService.getUsername()).subscribe(configuration => {
      this.cashRegisterName = configuration.cashRegister != null ? configuration.cashRegister.code : 'NINGUNA';
    });
  }

  searchCredits(value: string) {
    this.spinner.show();
    this.creditService.listCredits(value, this.creditStatus).subscribe(credits => {
      this.spinner.hide();
      this.credits = credits;
      this.searchIsEmpty = value == '';
      this.lastTextSearch = value;
      this.gridOptions.api.setRowData(this.credits);
    });
  }

  getCreditsByStatus() {
    this.spinner.show();
    this.creditService.listCredits('', this.creditStatus).subscribe(credits => {
      this.spinner.hide();
      this.credits = credits;
      this.loadData();
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
        headerName: 'Código de venta',
        valueFormatter: (params) => { return params.data.sale.code; },
        minWidth: 50
      },
      {
        headerName: 'Estado',
        valueFormatter: (params) => { return params.data.isFullyPaid ? "Completado" : "Pendiente"; },
        minWidth: 50,
        hide: this.creditStatus == 1 || this.creditStatus == 0
      },
      {
        headerName: 'Cliente',
        valueFormatter: (params) => { return params.data.client.name; },
        minWidth: 150
      },
      {
        headerName: 'Monto pagado',
        valueFormatter: (params) => { return Number(params.data.paidAmount).toFixed(2) + " Bs."; },
        minWidth: 65
      },
      {
        headerName: 'Monto total a pagar',
        valueFormatter: (params) => { return Number(params.data.totalAmount).toFixed(2) + " Bs."; },
        minWidth: 65
      },
      {
        headerName: 'Monto pendiente',
        valueFormatter: (params) => { return Number(params.data.totalAmount - params.data.paidAmount).toFixed(2) + " Bs."; },
        minWidth: 65
      },
      {
        headerName: 'Fecha de vencimiento del crédito',
        valueFormatter: (params) => { return this.getCreditExpirationDate(params.data.creditDate, params.data.creditDays); },
        minWidth: 170
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.addPayment.bind(this),
          label: 'plus-circle-outline',
          tooltip: 'Agregar pago',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60,
        hide: this.creditStatus == 1
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.viewPayments.bind(this),
          label: 'shopping-bag-outline',
          tooltip: 'Ver pagos',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.deleteCredit.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  addPayment(e) {
    var credit = new Credit;
    var client = new Client;
    credit = e.rowData;
    client = credit.client;
    this.modalOptions.size = 'md';
    const modalRef = this.modalService.open(AddPaymentModalComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      paymentAmount: 0,
      reference: '',
      totalAmount: credit.totalAmount - credit.paidAmount
    };
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var date = new Date(result.paymentDate.year, result.paymentDate.month - 1, result.paymentDate.day, 0, 0, 0);
        var paymentDate = this.datepipe.transform(date, "yyyy-MM-dd");
        this.paymentService.addPayment(result.paymentAmount, paymentDate, credit, client, result.reference).subscribe(payment => {
          this.toastrService.primary('Pago registrado', 'Éxito');
          this.searchCredits(this.lastTextSearch);
          this.paymentService.getPaymentReceipt(payment.id).subscribe(pdf => {
            this.pdfService.Open(pdf);
            this.spinner.hide();
          });
        });
      }
    });
  }

  viewPayments(c) {
    this.modalOptions.size = 'lg';
    const modalRef = this.modalService.open(ViewPaymentsComponent, this.modalOptions);
    modalRef.componentInstance.creditId = c.rowData.id;

    modalRef.result.then((result) => {
      this.searchCredits(this.lastTextSearch);
    });
  }

  deleteCredit(c) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar el crédito?`;
    modalRef.componentInstance.title = "Eliminar crédito";
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        this.creditService.deleteCredit(c.rowData.id).subscribe(() => {
          this.toastrService.primary('Crédito Eliminado.', 'Éxito');
          this.spinner.hide();
          this.searchCredits(this.lastTextSearch);
        },
          error => {
            this.toastrService.danger(error.error.error.message, 'Error')
            this.spinner.hide();
          });;
      }
    });
  }

  getCreditExpirationDate(createdDate, days) {
    var date = new Date(createdDate);
    date.setDate(date.getDate() + parseInt(days));

    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }
}

@Component({
  selector: 'app-add-payment-modal',
  templateUrl: './add-payment-modal.component.html'
})
export class AddPaymentModalComponent implements OnInit {
  public displayError: boolean = false;
  @Input() public data: any;
  public paymentDate: NgbDate;

  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig
  ) { }

  ngOnInit() {
    this.paymentDate = this.calendar.getToday();
    const currentDate = new Date();
    this.config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() }
  }

  payAll() {
    this.data.paymentDate = this.paymentDate;
    this.data.paymentAmount = this.data.totalAmount;
    this.activeModal.close(this.data);
  }

  addPartialPayment() {
    this.data.paymentDate = this.paymentDate;
    if (this.data.paymentAmount > this.data.totalAmount) {
      this.displayError = true;
    } else {
      this.activeModal.close(this.data);
    }
  }
}