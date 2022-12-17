import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Stock } from 'src/app/models/stock';
import { localeEs } from 'src/assets/locale.es.js';

@Component({
  selector: 'app-destination-stock',
  templateUrl: './destination-stock.component.html',
  styleUrls: ['./destination-stock.component.scss']
})
export class DestinationStockComponent implements OnInit {
  @Output() stockOriginSelected = new EventEmitter<any>();
  @Input() targetStockList: Stock[];
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
}
