import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { CashRegisterEntry } from 'src/app/models/cash-register-entry';
import { CashRegisterEntryService } from '../../services/cash-register-entry.service';
import { localeEs } from 'src/assets/locale.es.js';
import { EntryTypeEnum } from 'src/app/models/enums/entry-type-enum';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-cash-register-entries',
  templateUrl: './view-cash-register-entries.component.html',
  styleUrls: ['./view-cash-register-entries.component.scss']
})
export class ViewCashRegisterEntriesComponent implements OnInit {
  @Input() public cashRegisterId: any;
  public cashRegisterEntries: CashRegisterEntry[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public startDate: NgbDate;
  public endDate: NgbDate;

  constructor(
    private cashRegisterEntryService: CashRegisterEntryService,
    private datepipe: DatePipe,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastrService: NbToastrService,
    private spinner: NgxSpinnerService,
    private calendar: NgbCalendar
  ) { }

  ngOnInit(): void {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.endDate = this.calendar.getToday();
    this.startDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getUTCDate());

    this.getEntries();
    this.loadData();
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 15,
      onGridReady: (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
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
        headerName: 'Monto (Bs.)',
        valueFormatter: (params) => { return Number(params.data.amount).toFixed(2); },
        cellStyle: { 'text-align': 'right' },
        minWidth: 100
      },
      {
        headerName: 'Razón',
        valueFormatter: (params) => { return params.data.reason; },
        minWidth: 250
      },
      {
        headerName: 'Tipo',
        valueFormatter: (params) => { return this.viewEntryType(params.data.entryType); },
        minWidth: 100
      },
      {
        headerName: 'Fecha',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.date, 'dd/MM/yyyy HH:mm a'); },
        minWidth: 150
      },
      {
        headerName: 'Total (Bs.)',
        valueFormatter: (params) => { return Number(params.data.cashRegisterAmount).toFixed(2); },
        cellStyle: { 'text-align': 'right' },
        minWidth: 100
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.deleteCashRegistered.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          showOnlyFirst: true,
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  getEntries() {
    this.spinner.show();
    let startDate = this.datepipe.transform(new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day), 'yyyy-MM-dd');
    let endDate = this.datepipe.transform(new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day), 'yyyy-MM-dd');
    this.cashRegisterEntryService.listEntriesByCashRegister(startDate, endDate, this.cashRegisterId).subscribe(entries => {
      this.cashRegisterEntries = entries;
      this.spinner.hide();
    });
  }

  viewEntryType(entryType) {
    return entryType == EntryTypeEnum.DEBIT ? "Debe" : "Haber";
  }

  deleteCashRegistered(event) {
    let id = event.rowData.id;
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);

    modalRef.componentInstance.message = `¿Está seguro de eliminar la entrada con la razón ${event.rowData.reason}?`;
    modalRef.componentInstance.title = "Eliminar entrada";
    modalRef.result.then((result) => {

      if (result) {
        this.spinner.show();
        var cashRegisterEntry = this.cashRegisterEntries.find(cre => cre.id == id);
        var index = this.cashRegisterEntries.indexOf(cashRegisterEntry);
        if (index > -1) {
          this.cashRegisterEntryService.deleteEntriesByCashRegisterId(id).subscribe(
            (response) => {
              this.toastrService.primary('Registro Eliminado.', 'Éxito');
              this.cashRegisterEntries.splice(index, 1);
              this.gridOptions.api.setRowData(this.cashRegisterEntries);
              this.spinner.hide();
            }, (error) => {
              console.error(error)
              this.toastrService.primary(error.error.error.message, 'Error');
              this.spinner.hide();
            }
          );
        }
      }
    });
  }
}
