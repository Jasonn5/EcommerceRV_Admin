import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { Seller } from 'src/app/models/seller';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { SellerService } from '../../services/seller.service';
import { localeEs } from 'src/assets/locale.es.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-sellers',
  templateUrl: './view-sellers.component.html',
  styleUrls: ['./view-sellers.component.scss']
})
export class ViewSellersComponent implements OnInit {
  public sellers: Seller[] = [];
  public searchIsEmpty: boolean = true;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public columnDefs;
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;

  constructor(
    private sellerService: SellerService,
    private router: Router,
    private ngZone: NgZone,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };
    this.listSellers('');
    this.loadData();
    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.listSellers(text);
    });
  }

  listSellers(value: string) {
    this.spinner.show();
    this.sellerService.listSellers(value).subscribe(sellers => {
        this.sellers = sellers;
        this.searchIsEmpty = value == '';
        this.spinner.hide();
    });
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
        headerName: 'Código',
        valueFormatter: (params) => { return params.data.code; },
        minWidth: 100
      },
      {
        headerName: 'Nombre',
        valueFormatter: (params) => { return params.data.name; },
        minWidth: 250
      },
      {
        headerName: 'Dirección',
        valueFormatter: (params) => { return params.data.address; },
        minWidth: 250
      },
      {
        headerName: 'Celular',
        valueFormatter: (params) => { return params.data.cellPhone; },
        minWidth: 100
      },
      {
        headerName: 'Teléfono Fijo',
        valueFormatter: (params) => { return params.data.landLine; },
        minWidth: 100
      },
      {
        headerName: 'Email',
        valueFormatter: (params) => { return params.data.email; },
        minWidth: 250
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.sendSellerId.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Editar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  sendSellerId(e) {
    this.ngZone.run(() => this.router.navigate(['/sellers/edit-seller', e.rowData.id])).then();;
  }
}
