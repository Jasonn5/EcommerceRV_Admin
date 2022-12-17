import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationService } from 'src/app/management-app/admin/locations/services/location.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { Location } from 'src/app/models/location';
import { Product } from 'src/app/models/product';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-product-kardex-report',
  templateUrl: './product-kardex-report.component.html',
  styleUrls: ['./product-kardex-report.component.scss']
})
export class ProductKardexReportComponent implements OnInit {
  public startDate: NgbDate;
  public endDate: NgbDate;
  public reportId = ReportsEnum.ProductKardexReport;
  public selectedProduct: Product;
  public locations: Location[] = [];
  public locationId: number = 0;

  constructor(
    private reportService: ReportService,
    private calendar: NgbCalendar,
    private toastrService: NbToastrService,
    private locationService: LocationService,
    private pdfService: PdfService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.selectedProduct = null;
    this.endDate = this.calendar.getToday();
    this.startDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getUTCDate());
    this.locationService.listLocations().subscribe(locations => {
      this.locations = locations;
      if (this.locations.length > 0) {
        this.locationId = this.locations[0].id;
      }
    });
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
  }

  getPdf() {
    this.spinner.show();
    let startDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    let endDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    this.reportService.getPdf(startDate, endDate, this.reportId, this.selectedProduct.id, parseInt(this.locationId.toString())).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.spinner.hide();
    },
      (error) => {
        this.toastrService.danger("No hay movimientos registrados en el rango de fechas que se ingreso.", 'Error');
        this.spinner.hide();
      });
  }

  getExcel() {
    this.spinner.show();
    let startDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    let endDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    this.reportService.getExcel(startDate, endDate, this.reportId, this.selectedProduct.id, parseInt(this.locationId.toString())).subscribe(excel => {      
      let url = window.URL.createObjectURL(excel);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'kardex-del-producto.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.spinner.hide();
    },
      (error) => {
        this.toastrService.danger("No hay movimientos registrados en el rango de fechas que se ingreso.", 'Error');
        this.spinner.hide();
      });
  }
}
