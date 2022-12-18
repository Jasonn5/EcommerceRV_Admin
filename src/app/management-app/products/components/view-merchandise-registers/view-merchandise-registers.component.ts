import { DatePipe } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { MerchandiseRegister } from 'src/app/models/merchandise-register';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { MerchandiseRegisterService } from '../../services/merchandise-register.service';
import { localeEs } from 'src/assets/locale.es.js';
import { NgbCalendar, NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ViewMerchandiseRegisterDetailComponent } from './view-merchandise-register-detail/view-merchandise-register-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { ReportService } from 'src/app/management-app/reports/services/report.service';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-view-merchandise-registers',
  templateUrl: './view-merchandise-registers.component.html',
  styleUrls: ['./view-merchandise-registers.component.scss']
})
export class ViewMerchandiseRegistersComponent implements OnInit {
  public merchandiseRegisters: MerchandiseRegister[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public startDate: NgbDate;
  public endDate: NgbDate;

  constructor(
    private merchandiseRegisterService: MerchandiseRegisterService,
    private ngZone: NgZone,
    private router: Router,
    private datepipe: DatePipe,
    private modalService: NgbModal,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService,
    private reportService: ReportService,
    private pdfService: PdfService,
    private toastrService: NbToastrService,
    private calendar: NgbCalendar
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    }

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.startDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getUTCDate());
    this.endDate = this.calendar.getToday();

    this.getMerchandiseRegisters();
    this.loadData();
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
        headerName: 'Fecha',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.registerDate, 'dd/MM/yyyy HH:mm:ss'); },
        minWidth: 100
      },
      {
        headerName: 'Proveedor',
        valueFormatter: (params) => { return params.data.provider != null ? params.data.provider.name : "NINGUNO"; },
        minWidth: 100
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.viewMerchandiseRegisterDetail.bind(this),
          label: 'eye-outline',
          tooltip: 'Ver detalle del ingreso de mercadería',
          alwaysDisplayIcon: true
        },
        width: 30,
        minWidth: 30
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.sendMerchandiseRegisterId.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Editar',
          alwaysDisplayIcon: true
        },
        width: 30,
        minWidth: 30
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.printMerchandiseRegisterCopy.bind(this),
          label: 'file-outline',
          tooltip: 'Generar nota de ingreso a almacen',
          alwaysDisplayIcon: true
        },
        width: 30,
        minWidth: 30
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.downloadBill.bind(this),
          label: 'arrow-circle-down-outline',
          tooltip: 'Descargar',
          alwaysDisplayIcon: false,
          checkValueToDisplay: 'billUrl'
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  getMerchandiseRegisters() {
    this.spinner.show();
    let startDate = this.datepipe.transform(new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day), 'yyyy-MM-dd');
    let endDate = this.datepipe.transform(new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day), 'yyyy-MM-dd');
    this.merchandiseRegisterService.listMerchandiseRegisters(startDate, endDate).subscribe(merchandiseRegisters => {
      this.merchandiseRegisters = merchandiseRegisters;
      this.spinner.hide();
    });
  }

  sendMerchandiseRegisterId(e) {
    this.ngZone.run(() => this.router.navigate(['/products/update-merchandise-register', e.rowData.id])).then();
  }

  viewMerchandiseRegisterDetail(mr) {
    this.modalOptions.size = 'xl';
    const modalRef = this.modalService.open(ViewMerchandiseRegisterDetailComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      merchandiseRegisterId: mr.rowData.id
    };
  }

  printMerchandiseRegisterCopy(mr) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Generar nota de ingreso a almacen';
    modalRef.componentInstance.message = '¿Desea generar la nota?';
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        this.reportService.getPdf(new Date, new Date).subscribe(pdf => {
          this.pdfService.Open(pdf);
          this.spinner.hide();
        },
          (error) => {
            this.toastrService.danger("", 'Error');
            this.spinner.hide();
          });
      }
    });
  }

  downloadBill(d) {
    window.open(d.rowData.billUrl, '_blank');
  }
}
