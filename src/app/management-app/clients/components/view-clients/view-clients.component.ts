import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { Client } from 'src/app/models/client';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ClientService } from '../../services/client.service';
import { localeEs } from 'src/assets/locale.es.js';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.scss']
})
export class ViewClientsComponent implements OnInit {
  public clients: Client[] = [];
  public searchIsEmpty: boolean = true;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public columnDefs;
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;

  constructor(
    private clientsService: ClientService,
    private modalService: NgbModal,
    private router: Router,
    private ngZone: NgZone,
    private toastrService: NbToastrService,
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

    this.searchClients('');
    this.loadData();

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
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.sendClientId.bind(this),
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
          onClick: this.deleteClient.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  searchClients(value: string) {
    this.spinner.show();
    this.clientsService.searchClients(value).subscribe(clients => {
      this.spinner.hide();
      this.clients = clients;
      this.searchIsEmpty = value == '';
    });
  }

  deleteClient(e): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar el cliente ${e.rowData.name}?`;
    modalRef.componentInstance.title = "Eliminar cliente";
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var clients = this.clients.find(p => p.id == e.rowData.id);
        var index = this.clients.indexOf(clients);

        if (index > -1) {
          this.clientsService.deleteClient(clients.id).subscribe(() => {
            this.clients.splice(index, 1);
            this.toastrService.primary('Cliente Eliminado.', 'Éxito');
            this.gridOptions.api.setRowData(this.clients);
            this.spinner.hide();
          },
            error => {
              this.toastrService.danger(error.error.error.message, 'Error')
              this.spinner.hide();
            });
        }
      }
    });
  }

  sendClientId(e) {
    this.ngZone.run(() => this.router.navigate(['/clients/edit-client', e.rowData.id])).then();;
  }
}
