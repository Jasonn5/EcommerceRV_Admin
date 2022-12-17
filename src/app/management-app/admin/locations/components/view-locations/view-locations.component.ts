import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { Location } from "src/app/models/location";
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { LocationService } from '../../services/location.service';
import { localeEs } from 'src/assets/locale.es.js';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-locations',
  templateUrl: './view-locations.component.html',
  styleUrls: ['./view-locations.component.scss']
})
export class ViewLocationsComponent implements OnInit {
  public locations: Location[] = [];
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public columnDefs;

  constructor(
    private locationsService: LocationService,
    private modalService: NgbModal,
    private router: Router,
    private ngZone: NgZone,
    private toastrService: NbToastrService,
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

    this.locationsService.listLocations().subscribe(locations => {
      this.locations = locations;
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
        headerName: 'Cuidad',
        valueFormatter: (params) => { return params.data.city; },
        minWidth: 250
      },
      {
        headerName: 'Teléfono',
        valueFormatter: (params) => { return params.data.phone; },
        minWidth: 100
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.editLocation.bind(this),
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
          onClick: this.deleteLocation.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  deleteLocation(location): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = ('¿Esta seguro de eliminar la ubicación ' + location.rowData.name + '?').toString();
    modalRef.componentInstance.title = "Eliminar ubicación";
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var locations = this.locations.find(p => p.id == location.rowData.id);
        var index = this.locations.indexOf(locations);

        if (index > -1) {
          this.locationsService.deleteLocation(location.rowData.id).subscribe(() => {
            this.locations.splice(index, 1);
            this.toastrService.primary('Ubicación Eliminada.', 'Éxito');
            this.gridOptions.api.setRowData(this.locations);
            this.spinner.hide();
          },
            error => {
              this.toastrService.danger(error.error.error.message, 'Error')
              this.spinner.hide();
            });
        }
      }
    })
  }

  editLocation(e) {
    this.ngZone.run(() => this.router.navigate(['/admin/edit-location', e.rowData.id])).then();;
  }
}
