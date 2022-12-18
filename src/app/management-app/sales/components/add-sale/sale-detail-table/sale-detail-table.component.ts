import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { SaleDetail } from 'src/app/models/sale-detail';
import { localeEs } from 'src/assets/locale.es.js';

@Component({
  selector: 'app-sale-detail-table',
  templateUrl: './sale-detail-table.component.html',
  styleUrls: ['./sale-detail-table.component.scss']
})
export class SaleDetailTableComponent implements OnInit {
  @Output() saleDetailToEdit = new EventEmitter<any>();
  @Output() saleDetailToDelete = new EventEmitter<any>();
  @Input() saleDetails: SaleDetail[] = [];
  @Input() reloadSaleDetail: Subject<boolean> = new Subject<boolean>();
  @Input() totalCost;
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;
  public frameworkComponents: any;
  public noRowsTemplate;

  constructor() {
    this.noRowsTemplate = `Aún no hay productos seleccionados.`;
  }

  ngOnInit(): void {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };
    this.loadData();
    this.reloadSaleDetail.subscribe(response => {
      if (response) {
        this.gridOptions.api.setRowData(this.saleDetails);
      }
    });
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 15,
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
        minWidth: 250
      },
      {
        headerName: 'Cantidad',
        valueFormatter: (params) => { return params.data.quantity; },
        minWidth: 75
      },
      {
        headerName: 'P. Unitario',
        valueFormatter: (params) => { return Number(params.data.unitaryPrice).toFixed(2) + " Bs."; },
        minWidth: 80
      },
      {
        headerName: 'Total',
        valueFormatter: (params) => { return Number(params.data.totalPrice).toFixed(2) + " Bs."; },
        minWidth: 90
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
    this.saleDetailToEdit.emit(e.rowData);
  }

  delete(e) {
    this.saleDetailToDelete.emit(e.rowData);
  }
}
