import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { SaleService } from 'src/app/management-app/sales/services/sale.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { Bill } from 'src/app/models/bill';
import { BillStatusEnum } from 'src/app/models/enums/bill-status-enum';
import { localeEs } from 'src/assets/locale.es.js';
import { BillService } from '../../../services/bill.service';
import { ViewBillComponent } from '../view-bill/view-bill.component';

@Component({
  selector: 'app-view-bills-by-sale',
  templateUrl: './view-bills-by-sale.component.html',
  styleUrls: ['./view-bills-by-sale.component.scss']
})
export class ViewBillsBySaleComponent implements OnInit {
  @Input() bills: Bill[] = [];
  @Input() reloadBills: Subject<boolean> = new Subject<boolean>();
  @Output() reloadData = new EventEmitter<any>();
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;
  public frameworkComponents: any;
  public noRowsTemplate;
  public modalOptions: NgbModalOptions;

  constructor(
    private datepipe: DatePipe,
    private modalService: NgbModal,
    private saleService: SaleService,
    private billService: BillService,
    private pdfService: PdfService,
    private toastrService: NbToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.noRowsTemplate = `Aún no hay facturas registradas.`;
  }

  ngOnInit(): void {
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
    this.reloadBills.subscribe(response => {
      if (response) {
        this.gridOptions.api.setRowData(this.bills);
      }
    });
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
        headerName: 'N° de factura',
        valueFormatter: (params) => { return params.data.billNumber; },
        minWidth: 100
      },
      {
        headerName: 'Fecha',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.billDate, 'dd/MM/yyyy'); },
        minWidth: 120
      },
      {
        headerName: 'Cliente',
        valueFormatter: (params) => { return params.data.taxPaidName; },
        minWidth: 200
      },
      {
        headerName: 'NIT',
        valueFormatter: (params) => { return params.data.nit; },
        minWidth: 200
      },
      {
        headerName: 'Código de control',
        valueFormatter: (params) => { return params.data.controlCode; },
        minWidth: 150
      },
      {
        headerName: 'Estado',
        valueFormatter: (params) => { return params.data.statusId == BillStatusEnum.ACTIVE ? "Activa" : "Anulada" },
        minWidth: 100
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.viewDetail.bind(this),
          label: 'eye-outline',
          tooltip: 'Ver detalle',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.printCopy.bind(this),
          label: 'file-remove-outline',
          tooltip: 'Imprimir copia',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.printOriginal.bind(this),
          label: 'file-text-outline',
          tooltip: 'Imprimir original',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.cancelBill.bind(this),
          label: 'close-square-outline',
          tooltip: 'Anular factura',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  viewDetail(e) {
    this.modalOptions.size = 'xl';
    const modalRef = this.modalService.open(ViewBillComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      billId: e.rowData.id
    };
  }

  printCopy(e) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Factura';
    modalRef.componentInstance.message = '¿Desea generar una copia de la factura?';
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        this.saleService.printBill(e.rowData.id, true).subscribe(pdf => {
          this.pdfService.Open(pdf);
          this.spinner.hide();
        });
      }
    });
  }

  printOriginal(e) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Factura';
    modalRef.componentInstance.message = '¿Desea generar una copia de la factura original?';
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        this.saleService.printBill(e.rowData.id, false).subscribe(pdf => {
          this.pdfService.Open(pdf);
          this.spinner.hide();
        });
      }
    });
  }

  cancelBill(e) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Factura';
    modalRef.componentInstance.message = '¿Esta seguro de anular la factura?';
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        if (e.rowData.statusId == BillStatusEnum.ACTIVE) {
          this.billService.updateBill(e.rowData).subscribe(() => {
            this.toastrService.primary('Factura anulada', 'Éxito');
            this.spinner.hide();
            this.reloadData.emit(null);
          });
        } else {
          this.toastrService.danger('La factura ya fue anulada', 'Error');
          this.spinner.hide();
        }
      }
    });
  }
}
