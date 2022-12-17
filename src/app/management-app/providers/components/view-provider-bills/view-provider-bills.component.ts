import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { ProviderBill } from 'src/app/models/provider-bill';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ProviderBillService } from '../../services/provider-bill.service';
import { localeEs } from 'src/assets/locale.es.js';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-provider-bills',
  templateUrl: './view-provider-bills.component.html',
  styleUrls: ['./view-provider-bills.component.scss']
})
export class ViewProviderBillsComponent implements OnInit {
  public providersBill: ProviderBill[] = [];
  public searchIsEmpty: boolean = true;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public columnDefs;
  public start: NgbDate;
  public end: NgbDate;
  public initialDate: boolean = true;
  public messageError = null;

  constructor(
    private providerBillService: ProviderBillService,
    private router: Router,
    private ngZone: NgZone,
    private calendar: NgbCalendar,
    private internetConnectionService: InternetConnectionService,
    private datepipe: DatePipe,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.spinner.show();
    if (this.initialDate) {
      var endDate = new Date();
      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      this.end = this.calendar.getToday();
      this.start = new NgbDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getUTCDate());
      this.initialDate = false;
    }
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };

    var start = this.start.year + '-' + this.start.month + '-' + this.start.day;
    var end = this.end.year + '-' + this.end.month + '-' + this.end.day;

    this.providerBillService.searchProvidersBill(start, end).subscribe(providersBill => {
      this.providersBill = providersBill;
      this.spinner.hide();
    });
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
        headerName: 'Nombre',
        valueFormatter: (params) => { return params.data.providerName; },
        minWidth: 200
      },
      {
        headerName: 'Nit',
        valueFormatter: (params) => { return params.data.nit; },
        minWidth: 150
      },
      {
        headerName: 'Numero de Factura',
        valueFormatter: (params) => { return params.data.billNumber; },
        minWidth: 150
      },
      {
        headerName: 'Fecha de Factura',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.billDate, 'dd/MM/yyyy'); },
        minWidth: 150
      },
      {
        headerName: 'Codigo de control',
        valueFormatter: (params) => { return params.data.controlCode; },
        minWidth: 150
      },
      {
        headerName: 'Monto total',
        valueFormatter: (params) => { return params.data.totalAmount + ' Bs.'; },
        minWidth: 150
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.sendProviderId.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Edit',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  listProvidersBillByDate() {
    this.spinner.show();
    let startDate = new Date(this.start.year, this.start.month, this.start.day);
    let endDate = new Date(this.end.year, this.end.month, this.end.day);
    if (startDate > endDate || startDate == null || endDate == null) {
      this.messageError = "Error al ingresar el rango de fechas.";
      this.providersBill = [];
      this.spinner.hide();
    } else {
      var start = this.start.year + '-' + this.start.month + '-' + this.start.day;
      var end = this.end.year + '-' + this.end.month + '-' + this.end.day;
      this.providerBillService.searchProvidersBill(start, end).subscribe(providersBill => {
        this.providersBill = providersBill;
        this.messageError = null;
        this.spinner.hide();
      });
    }
  }

  sendProviderId(e) {
    this.ngZone.run(() => this.router.navigate(['/providers/edit-provider-bill', e.rowData.id])).then();;
  }
}
