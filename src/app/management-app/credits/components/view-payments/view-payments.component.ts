import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDatepickerConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { Payment } from 'src/app/models/payment';
import { PaymentService } from '../../services/payment.service';
import { localeEs } from 'src/assets/locale.es.js';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { Credit } from 'src/app/models/credit';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-payments',
  templateUrl: './view-payments.component.html',
  styleUrls: ['./view-payments.component.scss']
})
export class ViewPaymentsComponent implements OnInit {
  @Input() public creditId: any;
  public payments: Payment[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;

  constructor(
    private paymentService: PaymentService,
    private datepipe: DatePipe,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private pdfService: PdfService,
    private toastrService: NbToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    };
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      centered: true
    }
    this.loadData();
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 10,
      onGridReady: (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
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
        headerName: 'Fecha de creación',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.createdDate, 'dd/MM/yyyy HH:mm a'); },
        minWidth: 150
      },
      {
        headerName: 'Fecha del pago',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.paymentDate, 'dd/MM/yyyy'); },
        minWidth: 150
      },
      {
        headerName: 'Código de venta',
        valueFormatter: (params) => { return params.data.saleCode; },
        minWidth: 150
      },
      {
        headerName: 'Monto',
        valueFormatter: (params) => { return Number(params.data.amount).toFixed(2) + " Bs."; },
        minWidth: 100
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.generatePaymentReceipt.bind(this),
          label: 'eye-outline',
          tooltip: 'Generar comprobante',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.editPayment.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Editar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.deletePayment.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];

    this.paymentService.listPaymentsByCreditId(this.creditId).subscribe(payments => {
      this.payments = payments;
      this.spinner.hide();
    });
  }

  generatePaymentReceipt(payment) {
    this.spinner.show();
    this.paymentService.getPaymentReceipt(payment.rowData.id).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.spinner.hide();
    });
  }

  editPayment(payment) {
    var paymentToUpdate: Payment = new Payment();
    var credit: Credit = new Credit;
    this.paymentService.findById(payment.rowData.id).subscribe(payment => {
      paymentToUpdate = payment;
      credit = paymentToUpdate.credit;

      this.modalOptions.size = 'md';
      const modalRef = this.modalService.open(UpdatePaymentModalComponent, this.modalOptions);
      modalRef.componentInstance.data = {
        paymentAmount: paymentToUpdate.amount,
        reference: paymentToUpdate.reference,
        date: paymentToUpdate.paymentDate,
        totalAmount: credit.totalAmount - credit.paidAmount + paymentToUpdate.amount
      };
      modalRef.result.then((result) => {
        if (result) {
          this.spinner.show();
          var date = new Date(result.paymentDate.year, result.paymentDate.month - 1, result.paymentDate.day, 0, 0, 0);
          var paymentDate = this.datepipe.transform(date, "yyyy-MM-dd");
          this.paymentService.updatePayment(paymentToUpdate, result.paymentAmount, paymentDate, credit, result.reference).subscribe(payment => {
            this.toastrService.primary('Pago actualizado', 'Éxito');
            this.ngOnInit();
            this.paymentService.getPaymentReceipt(paymentToUpdate.id).subscribe(pdf => {
              this.pdfService.Open(pdf);
              this.spinner.hide();
            });
          });
        }
      });
    });
  }

  deletePayment(payment) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar el pago?`;
    modalRef.componentInstance.title = "Eliminar pago";
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var paymentToDelete = this.payments.find(p => p.id == payment.rowData.id);
        var index = this.payments.indexOf(paymentToDelete);

        if (index > -1) {
          this.paymentService.deletePayment(paymentToDelete.id).subscribe(() => {
            this.payments.splice(index, 1);
            this.toastrService.primary('Pago Eliminado.', 'Éxito');
            this.spinner.hide();
            this.gridOptions.api.setRowData(this.payments);
          },
            error => {
              this.toastrService.danger(error.error.error.message, 'Error')
              this.spinner.hide();
            });;
        }
      }
    });
  }
}

@Component({
  selector: 'app-update-payment-modal',
  templateUrl: './update-payment-modal.component.html'
})
export class UpdatePaymentModalComponent implements OnInit {
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
    var date = new Date(this.data.date);
    this.paymentDate.year = date.getFullYear();
    this.paymentDate.month = date.getMonth() + 1;
    this.paymentDate.day = date.getUTCDate();
    const currentDate = new Date();
    this.config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() }
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