import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { SellerService } from 'src/app/management-app/sellers/services/seller.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { Seller } from 'src/app/models/seller';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-sales-by-seller-report',
  templateUrl: './sales-by-seller-report.component.html',
  styleUrls: ['./sales-by-seller-report.component.scss']
})
export class SalesBySellerReportComponent implements OnInit {
  public startDate: NgbDate;
  public endDate: NgbDate;
  public reportId = ReportsEnum.SalesBySellerReport;
  public sellers: Seller[] = [];
  public sellerId: number = 0;

  constructor(
    private reportService: ReportService,
    private calendar: NgbCalendar,
    private toastrService: NbToastrService,
    private sellerService: SellerService,
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
    this.sellerService.listSellers('').subscribe(sellers => {
      this.sellers = sellers;
      if (this.sellers.length > 0) {
        this.sellerId = this.sellers[0].id;
      }
    });
  }

  getPdf() {
    this.spinner.show();
    let startDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    let endDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    this.reportService.getPdf(startDate, endDate, this.reportId, 0, 0, 0, 0, parseInt(this.sellerId.toString())).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.spinner.hide();
    },
      (error) => {
        this.toastrService.danger("No hay ventas registradas en el rango de fechas que se ingreso.", 'Error');
        this.spinner.hide();
      });
  }
}
