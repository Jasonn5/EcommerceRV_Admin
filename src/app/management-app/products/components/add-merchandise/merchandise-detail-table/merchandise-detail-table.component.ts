import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { MerchandiseDetail } from 'src/app/models/merchandise-detail';
import { localeEs } from 'src/assets/locale.es.js';

@Component({
  selector: 'app-merchandise-detail-table',
  templateUrl: './merchandise-detail-table.component.html',
  styleUrls: ['./merchandise-detail-table.component.scss']
})
export class MerchandiseDetailTableComponent implements OnInit {
  @Output() merchandiseDetailToEdit = new EventEmitter<any>();
  @Output() merchandiseDetailToDelete = new EventEmitter<any>();
  @Input() merchandiseDetails: MerchandiseDetail[] = [];
  @Input() reloadMerchandiseDetail: Subject<boolean> = new Subject<boolean>();
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
    this.reloadMerchandiseDetail.subscribe(response => {
      if (response) {
        this.gridOptions.api.setRowData(this.merchandiseDetails);
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
        headerName: 'Precio de compra (Bs.)',
        valueFormatter: (params) => { return Number(params.data.price).toFixed(2); },
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
    this.merchandiseDetailToEdit.emit(e.rowData);
  }

  delete(e) {
    this.merchandiseDetailToDelete.emit(e.rowData);
  }
}
