import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-sales-by-day-report',
  templateUrl: './sales-by-day-report.component.html',
  styleUrls: ['./sales-by-day-report.component.scss']
})
export class SalesByDayReportComponent implements OnInit {
  public start: NgbDate;
  public date: NgbDate;
  public salesReport = ReportsEnum.SaleByDayreport;

  constructor(
    private reportService: ReportService,
    private pdfService: PdfService,
    private calendar: NgbCalendar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.date = this.calendar.getToday();
  }

  getPdf() {
    this.spinner.show();
    let date = new Date(this.date.year, this.date.month - 1, this.date.day);
    this.reportService.getPdf(date, date, this.salesReport).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.spinner.hide();
    });
  }

  getExcel() {
    this.spinner.show();
    let date = new Date(this.date.year, this.date.month - 1, this.date.day);
    this.reportService.getExcel(date, date, this.salesReport).subscribe(excel => {
      let url = window.URL.createObjectURL(excel);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'ventas-del-dia.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.spinner.hide();
    });
  }
}
