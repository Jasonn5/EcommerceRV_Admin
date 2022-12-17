import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Client } from 'src/app/models/client';
import { ClientService } from '../../services/client.service';
import { localeEs } from 'src/assets/locale.es.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-search-client',
  templateUrl: './search-client.component.html',
  styleUrls: ['./search-client.component.scss']
})
export class SearchClientComponent implements OnInit {
  @Output() client = new EventEmitter<any>();
  @Input() isFromSale;
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;
  public searchIsEmpty: boolean = true;
  public clients: Client[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;
  public searchInputStyle;

  constructor(private clientsService: ClientService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.searchInputStyle = this.isFromSale ? "col-md-8" : "col-md-5";
    this.loadData();
    this.searchClients('');
    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchClients(text);
    });
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: this.isFromSale ? 8 : 15,
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

    if (this.isFromSale) {
      this.columnDefs = [
        {
          headerName: 'Nombre',
          valueFormatter: (params) => { return params.data.name; },
          minWidth: 250
        },
        {
          headerName: 'NIT',
          valueFormatter: (params) => { return params.data.nit; },
          minWidth: 100
        }
      ];
    } else {
      this.columnDefs = [
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
          headerName: 'Teléfono',
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
          headerName: 'NIT',
          valueFormatter: (params) => { return params.data.nit; },
          minWidth: 100
        }
      ];
    }
  }

  searchClients(value: string) {
    this.spinner.show();
    this.clientsService.searchClients(value).subscribe(clients => {
      this.clients = clients;
      this.searchIsEmpty = value == '';
      this.spinner.hide();
    });
  }

  onSelectionChanged() {
    var selectedClient = this.gridApi.getSelectedRows();
    this.client.emit(selectedClient[0]);
  }
}
