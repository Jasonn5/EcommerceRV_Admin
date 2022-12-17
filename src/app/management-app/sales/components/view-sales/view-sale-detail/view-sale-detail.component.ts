import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { Sale } from 'src/app/models/sale';
import { SaleDetail } from 'src/app/models/sale-detail';
import { SaleService } from '../../../services/sale.service';
import { localeEs } from 'src/assets/locale.es.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-sale-detail',
  templateUrl: './view-sale-detail.component.html',
  styleUrls: ['./view-sale-detail.component.scss']
})
export class ViewSaleDetailComponent implements OnInit {
  @Input() public data: any;
  public sale: Sale;
  public saleDetails: SaleDetail[] = [];
  public gridOptions: GridOptions;
  public columnDefs;
  public totalCost;
  public saleType: string = "";
  public clientName;
  public clientNit;

  constructor(
    public activeModal: NgbActiveModal,
    private saleService: SaleService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.sale = new Sale();
    this.saleDetails = [];
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
        minWidth: 100
      },
      {
        headerName: 'Subtotal',
        valueFormatter: (params) => { return Number(params.data.totalPrice).toFixed(2) + " Bs."; },
        minWidth: 100
      }
    ];

    this.saleService.findById(this.data.saleId).subscribe(sale => {
      this.sale = sale;
      this.saleDetails = this.sale.saleDetails;
      this.saleType = this.sale.credit != null ? "Venta a crédito" : "Venta al contado";
      this.clientName = this.sale.client != null ? this.sale.client.name : "SIN NOMBRE";
      this.clientNit = this.sale.client != null ? this.sale.client.nit : 0;
      this.totalCost = this.saleDetails.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
      this.spinner.hide();
    });
  }
}
