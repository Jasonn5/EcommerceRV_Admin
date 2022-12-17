import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExpenseService } from 'src/app/management-app/expenses/services/expense.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-expense-report',
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.scss']
})
export class ExpenseReportComponent implements OnInit {
  public startDate: NgbDate;
  public endDate: NgbDate;
  public reportId = ReportsEnum.ExpenseReport;

  constructor(
    private reportService: ReportService,
    private calendar: NgbCalendar,
    private toastrService: NbToastrService,
    private pdfService: PdfService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.endDate = this.calendar.getToday();
    this.startDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getUTCDate());
  }

  getPdf() {
    this.spinner.show();
    let startDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    let endDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    this.reportService.getPdf(startDate, endDate, this.reportId, 0, 0, 0, 0, 0, 0).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.spinner.hide();
    },
      (error) => {
        this.toastrService.danger("No hay registros de gastos registrados en el rango de fechas que se ingreso.", 'Error');
        this.spinner.hide();
      });
  }

  getExcel() {
    this.spinner.show();
    let startDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    let endDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    this.reportService.getExcel(startDate, endDate, this.reportId, 0, 0, 0, 0, 0, 0).subscribe(excel => {
      let url = window.URL.createObjectURL(excel);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'registros-de-gastos.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.spinner.hide();
    },
      (error) => {
        this.toastrService.danger("No hay registros de gastos registrados en el rango de fechas que se ingreso.", 'Error');
        this.spinner.hide();
      });
  }
}
