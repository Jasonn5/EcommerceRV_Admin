import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { BusinessService } from 'src/app/models/business-service';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { localeEs } from 'src/assets/locale.es.js';
import { DurationMeasureTypePipe } from '../../pipes/duration-measure-type.pipe';
import { BusinessServiceService } from '../../services/business-service.service';

@Component({
  selector: 'app-view-business-services',
  templateUrl: './view-business-services.component.html',
  styleUrls: ['./view-business-services.component.scss']
})
export class ViewBusinessServicesComponent implements OnInit {
  public businessServices: BusinessService[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public companyName: string;
  public modalOptions: NgbModalOptions;
  public searchIsEmpty: boolean = true;
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;

  constructor(
    private businessServiceService: BusinessServiceService,
    private durationMeasureTypePipe: DurationMeasureTypePipe,
    private modalService: NgbModal,
    private ngZone: NgZone,
    private toastrService: NbToastrService,
    private router: Router,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    };

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    };

    this.searchBusinessService('');
    this.loadData();

    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchBusinessService(text);
    });
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 20,
      onGridReady: params => {
        params.api.sizeColumnsToFit();
        params.api.collapseAll();
      },
      onGridSizeChanged: params => {
        params.api.collapseAll();
      },
      defaultColDef: {
        resizable: true
      },
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    };

    this.columnDefs = [
      {
        headerName: 'Código',
        valueFormatter: params => { return params.data.code; },
        minWidth: 100
      },
      {
        headerName: 'Nombre',
        valueFormatter: params => { return params.data.businessServiceName; },
        minWidth: 250
      },
      {
        headerName: 'Descripción',
        valueFormatter: params => { return params.data.description; }
      },
      {
        headerName: 'Precio',
        valueFormatter: params => { return Number(params.data.price).toFixed(2) + " Bs."; },
        minWidth: 100
      },
      {
        headerName: 'Duración',
        valueFormatter: params => { return params.data.durationTime + " " + this.durationMeasureTypePipe.transform(params.data.durationMeasureId); },
        minWidth: 100
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.editService.bind(this),
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
          onClick: this.deleteBusinessService.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  searchBusinessService(value: string) {
    this.spinner.show();
    this.businessServiceService.searchBusinessServices(value).subscribe(businessServices => {
      this.spinner.hide();
      this.businessServices = businessServices;
      this.searchIsEmpty = value == '';
    });
  }

  deleteBusinessService(e): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar el servicio ${e.rowData.businessServiceName}?`;
    modalRef.componentInstance.title = 'Eliminar servicio';
    modalRef.result.then(result => {
      if (result) {
        this.spinner.show();
        var businessServices = this.businessServices.find(bs => bs.id == e.rowData.id);
        var index = this.businessServices.indexOf(businessServices);
        if (index > -1) {
          this.businessServiceService.deleteBusinessService(businessServices.id).subscribe(() => {
            this.businessServices.splice(index, 1);
            this.toastrService.primary('Servicio Eliminado', 'Éxito');
            this.gridOptions.api.setRowData(this.businessServices);
            this.spinner.hide();
          },
            error => {
              this.toastrService.danger(error.error.error.message, 'Error');
              this.spinner.hide();
            }
          );
        }
      }
    });
  }

  editService(e) {
    this.ngZone.run(() => this.router.navigate(['/business-services/edit-service', e.rowData.id])).then();
  }
}
