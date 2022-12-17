import { Component, Input, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Stock } from 'src/app/models/stock';
import { localeEs } from 'src/assets/locale.es.js';

@Component({
  selector: 'app-stock-products-table',
  templateUrl: './stock-products-table.component.html',
  styleUrls: ['./stock-products-table.component.scss']
})
export class StockProductsTableComponent implements OnInit {
  @Input() stocks: Stock[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 20,
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
        headerName: 'Código',
        valueFormatter: (params) => { return params.data.product.code; },
        minWidth: 200
      },
      {
        headerName: 'Producto',
        valueFormatter: (params) => { return params.data.product.displayName; },
        minWidth: 200
      },
      {
        headerName: 'Cantidad',
        valueFormatter: (params) => { return params.data.quantity; },
        minWidth: 200
      }
    ];
  }
}
