import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { BillConfiguration } from 'src/app/models/bill-configuration';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { BillConfigurationService } from '../../services/bill-configuration.service';
import { localeEs } from 'src/assets/locale.es.js';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-bill-configurations',
  templateUrl: './view-bill-configurations.component.html',
  styleUrls: ['./view-bill-configurations.component.scss']
})
export class ViewBillConfigurationsComponent implements OnInit {
  public dataSource: BillConfiguration[] = [];
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public columnDefs;

  constructor(
    private billConfigurationService: BillConfigurationService,
    private modalService: NgbModal,
    private router: Router,
    private ngZone: NgZone,
    private toastrService: NbToastrService,
    private datepipe: DatePipe,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.spinner.show();

    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };

    this.loadData();

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    }

    this.billConfigurationService.listBillConfigurations().subscribe(billConfigurations => {
      this.dataSource = billConfigurations;
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
        headerName: 'Número de autorización',
        valueFormatter: (params) => { return params.data.authorizationNumber; },
        minWidth: 150
      },
      {
        headerName: 'Fecha límite de emisíon',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.emissionLimitDate, 'dd/MM/yyyy'); },
        minWidth: 150
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.editBillConfiguration.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Editar',
          alwaysDisplayIcon: true
        },
        minWidth: 60,
        width: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.deleteBillConfiguration.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        minWidth: 60,
        width: 60
      }
    ];
  }

  deleteBillConfiguration(billConfiguration): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar la dosificación ${billConfiguration.rowData.name}?`;
    modalRef.componentInstance.title = "Eliminar dosificación";
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var dataSource = this.dataSource.find(p => p.id == billConfiguration.rowData.id);
        var index = this.dataSource.indexOf(dataSource);

        if (index > -1) {
          this.billConfigurationService.deleteBillConfiguration(billConfiguration.rowData.id).subscribe(() => {
            this.dataSource.splice(index, 1);
            this.toastrService.primary('Dosificación Eliminada.', 'Éxito');
          },
            (error) => {
              this.toastrService.danger(error.error.error.message, 'Error')
              this.spinner.hide();
            });;
        }
        this.gridOptions.api.setRowData(this.dataSource);
        this.spinner.hide();
      }
    });
  }

  editBillConfiguration(e) {
    this.ngZone.run(() => this.router.navigate(['/admin/billing/billing-information-editor', e.rowData.id])).then();;
  }
}
