import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { Provider } from 'src/app/models/provider';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ProviderService } from '../../services/provider.service';
import { localeEs } from 'src/assets/locale.es.js';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-providers',
  templateUrl: './view-providers.component.html',
  styleUrls: ['./view-providers.component.scss']
})
export class ViewProvidersComponent implements OnInit {
  public providers: Provider[] = [];
  public searchIsEmpty: boolean = true;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public columnDefs;
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;

  constructor(
    private providerService: ProviderService,
    private modalService: NgbModal,
    private router: Router,
    private toastrService: NbToastrService,
    private ngZone: NgZone,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    }

    this.searchProvider('');
    this.loadData();

    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchProvider(text);
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
        headerName: 'Nombre',
        valueFormatter: (params) => { return params.data.name; },
        minWidth: 200
      },
      {
        headerName: 'Dirección',
        valueFormatter: (params) => { return params.data.address; },
        minWidth: 200
      },
      {
        headerName: 'Teléfono',
        valueFormatter: (params) => { return params.data.cellPhone; },
        minWidth: 200
      },
      {
        headerName: 'Teléfono Fijo',
        valueFormatter: (params) => { return params.data.landLine; },
        minWidth: 200
      },
      {
        headerName: 'Email',
        valueFormatter: (params) => { return params.data.email; },
        minWidth: 200
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.sendProviderId.bind(this),
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
          onClick: this.deleteProvider.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  searchProvider(value: string) {
    this.spinner.show();
    this.providerService.searchProviders(value).subscribe(providers => {
      this.providers = providers;
      this.searchIsEmpty = value == '';
      this.spinner.hide();
    });
  }

  deleteProvider(e): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar el proveedor ${e.rowData.name}?`;
    modalRef.componentInstance.title = "Eliminar proveedor";
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var providers = this.providers.find(p => p.id == e.rowData.id);
        var index = this.providers.indexOf(providers);

        if (index > -1) {
          this.providerService.deleteProvider(providers.id).subscribe(() => {
            this.providers.splice(index, 1);
            this.toastrService.primary('Proveedor Eliminado.', 'Éxito');
            this.gridOptions.api.setRowData(this.providers);
            this.spinner.hide();
          },
            error => {
              this.toastrService.danger(error.error.error.message, 'Error')
              this.spinner.hide();
            });;
        }
        this.gridOptions.api.setRowData(this.providers);
      }
    });
  }

  sendProviderId(e) {
    this.ngZone.run(() => this.router.navigate(['/providers/edit-provider', e.rowData.id])).then();;
  }
}
