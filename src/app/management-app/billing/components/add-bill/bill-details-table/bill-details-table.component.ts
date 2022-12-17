import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { BillDetail } from 'src/app/models/bill-detail';
import { localeEs } from 'src/assets/locale.es.js';

@Component({
  selector: 'app-bill-details-table',
  templateUrl: './bill-details-table.component.html',
  styleUrls: ['./bill-details-table.component.scss']
})
export class BillDetailsTableComponent implements OnInit {
  @Output() billDetailToEdit = new EventEmitter<any>();
  @Output() billDetailToDelete = new EventEmitter<any>();
  @Input() billDetails: BillDetail[] = [];
  @Input() reloadbillDetails: Subject<boolean> = new Subject<boolean>();
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;
  public frameworkComponents: any;
  public noRowsTemplate;

  constructor() { }

  ngOnInit(): void {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    };
    this.loadData();
    this.reloadbillDetails.subscribe(response => {
      if (response) {
        this.gridOptions.api.setRowData(this.billDetails);
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
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.edit.bind(this),
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
          onClick: this.delete.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
    ];
  }

  edit(e) {
    this.billDetailToEdit.emit(e.rowData);
  }

  delete(e) {
    this.billDetailToDelete.emit(e.rowData);
  }
}
