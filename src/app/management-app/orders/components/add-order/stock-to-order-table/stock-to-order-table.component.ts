import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { Stock } from 'src/app/models/stock';
import { localeEs } from 'src/assets/locale.es.js';

@Component({
  selector: 'app-stock-to-order-table',
  templateUrl: './stock-to-order-table.component.html',
  styleUrls: ['./stock-to-order-table.component.scss']
})
export class StockToOrderTableComponent implements OnInit {
  @Output() selectedStock = new EventEmitter<any>();
  @Input() reloadProducts: Subject<boolean> = new Subject<boolean>();
  @Input() stocks: Stock[];
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;

  constructor() { }

  ngOnInit(): void {
    this.loadData();
    this.reloadProducts.subscribe(response => {
      if (response) {
        this.gridOptions.api.setRowData(this.stocks);
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
      rowSelection: 'single',
      defaultColDef: {
        resizable: true
      },
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }
    this.columnDefs = [
      {
        headerName: 'Código',
        valueFormatter: (params) => { return params.data.product.code; },
        width: 70,
        minWidth: 70
      },
      {
        headerName: 'Producto',
        valueFormatter: (params) => { return params.data.product.displayName; },
        minWidth: 250
      },
      {
        headerName: 'Precio',
        cellRenderer: (params) => { return params.data.product.price; },
        minWidth: 60
      },
      {
        headerName: 'Cantidad',
        valueFormatter: (params) => { return params.data.quantity; },
        minWidth: 60
      },
      {
        headerName: 'Ubicación',
        valueFormatter: (params) => { return params.data.location.name; },
        minWidth: 200
      }
    ];
  }

  onRowClicked(event) {
    this.selectedStock.emit(event.data);
    if (this.stocks.length != 0) {
      this.gridOptions.api.setRowData(this.stocks);
    }
  }

  htmlFormat(product) {
    if (product.discount != 0) {
      var priceWithDiscount = document.createElement('span');
      priceWithDiscount.innerHTML = Number(product.price - (product.price * product.discount) / 100).toFixed(2) + " Bs.";
      var normalPrice = document.createElement('s');
      normalPrice.innerHTML = product.price + " Bs. ";
      var parent_div = document.createElement('div');

      parent_div.appendChild(normalPrice);
      parent_div.appendChild(priceWithDiscount);

      return parent_div;
    } else {
      return Number(product.price).toFixed(2) + " Bs.";
    }
  }
}
