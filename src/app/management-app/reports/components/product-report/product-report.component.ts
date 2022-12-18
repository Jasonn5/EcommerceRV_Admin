import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.scss']
})
export class ProductReportComponent implements OnInit {
  public generatePdf: FormGroup;
  public start: NgbDate;
  public end: NgbDate;
  public salesByProductReport = ReportsEnum.SalesByProductReport;

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
    let startDate = new Date(this.start.year, this.start.month - 1, this.start.day);
    let endDate = new Date(this.end.year, this.end.month - 1, this.end.day);
    this.spinner.show();
    this.reportService.getPdf(startDate, endDate).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.spinner.hide();
    });
  }

  getExcel() {
    this.spinner.show();
    let startDate = new Date(this.start.year, this.start.month - 1, this.start.day);
    let endDate = new Date(this.end.year, this.end.month - 1, this.end.day);
    this.reportService.getExcel(startDate, endDate, this.salesByProductReport).subscribe(excel => {
      let url = window.URL.createObjectURL(excel);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'registros-de-cuenta.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.spinner.hide();
    });
  }
}
