import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { MerchandiseDetail } from 'src/app/models/merchandise-detail';
import { MerchandiseRegister } from 'src/app/models/merchandise-register';
import { MerchandiseRegisterService } from '../../../services/merchandise-register.service';
import { localeEs } from 'src/assets/locale.es.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-merchandise-register-detail',
  templateUrl: './view-merchandise-register-detail.component.html',
  styleUrls: ['./view-merchandise-register-detail.component.scss']
})
export class ViewMerchandiseRegisterDetailComponent implements OnInit {
  @Input() public data: any;
  public merchandiseRegister: MerchandiseRegister;
  public merchandiseDetails: MerchandiseDetail[] = [];
  public gridOptions: GridOptions;
  public columnDefs;

  constructor(
    public activeModal: NgbActiveModal,
    public merchandiseRegisterService: MerchandiseRegisterService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.merchandiseRegister = new MerchandiseRegister();
    this.merchandiseDetails = [];
    this.spinner.show();
    this.loadData();
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
        headerName: 'Precio',
        valueFormatter: (params) => { return Number(params.data.price).toFixed(2) + " Bs."; },
        minWidth: 200
      }
    ];

    this.merchandiseRegisterService.findById(this.data.merchandiseRegisterId).subscribe(merchandiseRegister => {
      this.merchandiseRegister = merchandiseRegister;
      this.merchandiseDetails = this.merchandiseRegister.merchandiseDetails;
      this.spinner.hide();
    });
  }
}
