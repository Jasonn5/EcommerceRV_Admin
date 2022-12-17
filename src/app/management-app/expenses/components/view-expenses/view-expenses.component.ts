import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Expense } from 'src/app/models/expense';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ExpenseService } from '../../services/expense.service';
import { localeEs } from 'src/assets/locale.es.js';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.component.html',
  styleUrls: ['./view-expenses.component.scss']
})
export class ViewExpensesComponent implements OnInit {
  public expenses: Expense[] = [];
  public searchIsEmpty: boolean = true;
  public columnDefs;
  public gridOptions: GridOptions;
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;

  constructor(
    private expenseService: ExpenseService,
    private datepipe: DatePipe,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();

    this.searchExpenses('');
    this.loadData();

    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchExpenses(text);
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
        headerName: 'Monto',
        valueFormatter: (params) => { return Number(params.data.amount).toFixed(2) + " Bs."; },
        minWidth: 100
      },
      {
        headerName: 'Descripción',
        valueFormatter: (params) => { return params.data.description; },
        minWidth: 250
      },
      {
        headerName: 'Fecha',
        valueFormatter: (params) => { return this.datepipe.transform(params.data.expenseDate, 'dd/MM/yyyy HH:mm:ss'); },
        minWidth: 150
      }
    ];
  }

  searchExpenses(value: string) {
    this.spinner.show();
    this.expenseService.searchExpenses(value).subscribe(expenses => {
      this.spinner.hide();
      this.expenses = expenses;
      this.searchIsEmpty = value == '';
    });
  }
}
