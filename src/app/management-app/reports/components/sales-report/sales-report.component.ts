import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {
  public generatePdf: FormGroup;
  public start: NgbDate;
  public end: NgbDate;
  public salesReport = ReportsEnum.SalesReport;

  constructor(
    private reportService: ReportService,
    private calendar: NgbCalendar,
    private pdfService: PdfService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.end = this.calendar.getToday();
    this.start = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getUTCDate());
  }

  getPdf() {
    this.spinner.show();
    let startDate = new Date(this.start.year, this.start.month - 1, this.start.day);
    let endDate = new Date(this.end.year, this.end.month - 1, this.end.day);
    this.reportService.getPdf(startDate, endDate).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.spinner.hide();
    });
  }

  getExcel() {
    this.spinner.show();
    let startDate = new Date(this.start.year, this.start.month - 1, this.start.day);
    let endDate = new Date(this.end.year, this.end.month - 1, this.end.day);
    this.reportService.getExcel(startDate, endDate, this.salesReport).subscribe(excel => {
      let url = window.URL.createObjectURL(excel);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'ventas.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.spinner.hide();
    });
  }
}
