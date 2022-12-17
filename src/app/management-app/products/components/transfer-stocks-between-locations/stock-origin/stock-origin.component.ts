import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Stock } from 'src/app/models/stock';
import { localeEs } from 'src/assets/locale.es.js';

@Component({
  selector: 'app-stock-origin',
  templateUrl: './stock-origin.component.html',
  styleUrls: ['./stock-origin.component.scss']
})
export class StockOriginComponent implements OnInit {
  @Output() stockOriginSelected = new EventEmitter<any>();
  @Input() originStockList: Stock[];
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;

  constructor(
  ) { }

  ngOnInit() {
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
      rowSelection: 'single',
      defaultColDef: {
        resizable: true
      },
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }

    this.columnDefs = [
      {
        headerName: 'Código',
        valueFormatter: (params) => { return params.data.product.code != null ? params.data.product.code : ""; },
        minWidth: 100
      },
      {
        headerName: 'Producto',
        valueFormatter: (params) => { return params.data.product.name != null ? params.data.product.name : ""; },
        minWidth: 250
      },
      {
        headerName: 'Cantidad',
        valueFormatter: (params) => { return params.data.quantity != null ? params.data.quantity : ""; },
        minWidth: 100
      }
    ];
  }

  onSelectionChanged() {
    var selectedStock = this.gridApi.getSelectedRows();
    this.stockOriginSelected.emit(selectedStock[0]);
  }
}
