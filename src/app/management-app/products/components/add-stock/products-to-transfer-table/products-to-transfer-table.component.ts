import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { ProductService } from '../../../services/product.service';
import { localeEs } from 'src/assets/locale.es.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products-to-transfer-table',
  templateUrl: './products-to-transfer-table.component.html',
  styleUrls: ['./products-to-transfer-table.component.scss']
})
export class ProductsToTransferTableComponent implements OnInit {
  @Output() product = new EventEmitter<any>();
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;
  public searchIsEmpty: boolean = true;
  public products: Product[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;

  constructor(private productService: ProductService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadData();
    this.searchProducts('');
    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchProducts(text);
    });
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
        valueFormatter: (params) => { return params.data.code; },
        minWidth: 200
      },
      {
        headerName: 'Nombre',
        valueFormatter: (params) => { return params.data.displayName; },
        minWidth: 200
      },
      {
        headerName: 'Categoría',
        valueFormatter: (params) => { return params.data.category != null ? params.data.category.name : "NINGUNA"; },
        minWidth: 200
      },
      {
        headerName: 'Precio de venta (Bs.)',
        valueFormatter: (params) => { return Number(params.data.price).toFixed(2); },
        minWidth: 200
      }
    ];
  }

  searchProducts(value: string) {
    this.spinner.show();
    this.productService.searchProducts(value).subscribe(products => {
      this.products = products;
      this.searchIsEmpty = value == '';
      this.spinner.hide();
    });
  }

  onSelectionChanged() {
    var selectedProduct = this.gridApi.getSelectedRows();
    this.product.emit(selectedProduct[0]);
  }
}
