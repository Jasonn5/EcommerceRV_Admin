import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { OrderDetail } from 'src/app/models/order-detail';
import { localeEs } from 'src/assets/locale.es.js';

@Component({
  selector: 'app-order-detail-table',
  templateUrl: './order-detail-table.component.html',
  styleUrls: ['./order-detail-table.component.scss']
})
export class OrderDetailTableComponent implements OnInit {
  @Output() orderDetailToEdit = new EventEmitter<any>();
  @Output() orderDetailToDelete = new EventEmitter<any>();
  @Input() orderDetails: OrderDetail[] = [];
  @Input() reloadOrderDetail: Subject<boolean> = new Subject<boolean>();
  @Input() totalCost;
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;
  public frameworkComponents: any;
  public noRowsTemplate;

  constructor(private spinner: NgxSpinnerService) {
    this.noRowsTemplate = `Aún no hay productos seleccionados.`;
  }

  ngOnInit(): void {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };
    this.loadData();
    this.reloadOrderDetail.subscribe(response => {
      this.spinner.show();
      if (response) {
        this.gridOptions.api.setRowData(this.orderDetails);
        this.spinner.hide();
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
        minWidth: 150
      },
      {
        headerName: 'Cantidad',
        valueFormatter: (params) => { return params.data.quantity; },
        minWidth: 80
      },
      {
        headerName: 'Ubicación',
        valueFormatter: (params) => { return params.data.locationName; },
        minWidth: 120
      },
      {
        headerName: 'Precio Unitario',
        valueFormatter: (params) => { return Number(params.data.unitaryPrice).toFixed(2) + " Bs."; },
        minWidth: 120
      },
      {
        headerName: 'Total',
        valueFormatter: (params) => { return Number(params.data.totalPrice).toFixed(2) + " Bs."; },
        minWidth: 120
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
    this.orderDetailToEdit.emit(e.rowData);
  }

  delete(e) {
    this.orderDetailToDelete.emit(e.rowData);
  }
}
