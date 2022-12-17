import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { Bill } from 'src/app/models/bill';
import { BillDetail } from 'src/app/models/bill-detail';
import { BillService } from '../../../services/bill.service';
import { localeEs } from 'src/assets/locale.es.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  @Input() public data: any;
  public bill: Bill;
  public billDetails: BillDetail[] = [];
  public gridOptions: GridOptions;
  public columnDefs;
  public billDate;
  public clientName;
  public clientNit;
  public totalCost;

  constructor(
    public activeModal: NgbActiveModal,
    private billService: BillService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.bill = new Bill();
    this.billDetails = [];
    this.spinner.show();
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
        minWidth: 200
      },
      {
        headerName: 'Precio total',
        valueFormatter: (params) => { return Number(params.data.totalPrice).toFixed(2) + " Bs."; },
        minWidth: 200
      }
    ];

    this.billService.findById(this.data.billId).subscribe(bill => {
      this.bill = bill;
      this.billDetails = this.bill.billDetails;
      this.clientName = this.bill.taxPaidName;
      this.clientNit = this.bill.nit;
      this.billDate = this.bill.billDate;
      this.totalCost = this.billDetails.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
      this.spinner.hide();
    });
  }
}
