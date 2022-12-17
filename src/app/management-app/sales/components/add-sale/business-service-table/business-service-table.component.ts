import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { DurationMeasureTypePipe } from 'src/app/management-app/business-services/pipes/duration-measure-type.pipe';
import { BusinessService } from 'src/app/models/business-service';

@Component({
  selector: 'app-business-service-table',
  templateUrl: './business-service-table.component.html',
  styleUrls: ['./business-service-table.component.scss']
})
export class BusinessServiceTableComponent implements OnInit {
  @Output() selectedService = new EventEmitter<any>();
  @Input() businessServices: BusinessService[];
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;

  constructor(
    private durationMeasureTypePipe: DurationMeasureTypePipe,
  ) { }

  ngOnInit() {
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
      }
    }

    this.columnDefs = [
      {
        headerName: 'Código',
        valueFormatter: params => { return params.data.code; },
        minWidth: 150
      },
      {
        headerName: 'Nombre',
        valueFormatter: params => { return params.data.businessServiceName; },
        minWidth: 270
      },
      {
        headerName: 'Descripción',
        valueFormatter: params => { return params.data.description; },
        minWidth: 300
      },
      {
        headerName: 'Precio',
        valueFormatter: params => { return Number(params.data.price).toFixed(2) + " Bs." },
        minWidth: 150
      },
      {
        headerName: 'Duración',
        valueFormatter: params => { return params.data.durationTime + " " + this.durationMeasureTypePipe.transform(params.data.durationMeasureId); },
        minWidth: 150
      }
    ];
  }

  onRowClicked(event) {
    this.selectedService.emit(event.data);
  }

}
