import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { Client } from 'src/app/models/client';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-client-kardex-report',
  templateUrl: './client-kardex-report.component.html',
  styleUrls: ['./client-kardex-report.component.scss']
})
export class ClientKardexReportComponent implements OnInit {
  public startDate: NgbDate;
  public endDate: NgbDate;
  public reportId = ReportsEnum.ClientKardexReport;
  public selectedClient: Client;
  public isFromSale: boolean = false;

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
    this.selectedClient = null;
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.endDate = this.calendar.getToday();
    this.startDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getUTCDate());
  }

  selectClient(client: Client) {
    this.selectedClient = client;
  }

  getPdf() {
    this.spinner.show();
    let startDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    let endDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    this.reportService.getPdf(startDate, endDate, this.reportId, 0, 0, this.selectedClient.id).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.spinner.hide();
    },
      (error) => {
        this.toastrService.danger("No existen créditos ni pagos registrados en el rango de fechas que se ingreso.", 'Error');
        this.spinner.hide();
      });
  }

  getExcel() {
    this.spinner.show();
    let startDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    let endDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    this.reportService.getExcel(startDate, endDate, this.reportId, 0, 0, this.selectedClient.id).subscribe(excel => {
      let url = window.URL.createObjectURL(excel);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'kardex-del-cliente.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.spinner.hide();
    },
      (error) => {
        this.toastrService.danger("No existen créditos ni pagos registrados en el rango de fechas que se ingreso.", 'Error');
        this.spinner.hide();
      });
  }
}
