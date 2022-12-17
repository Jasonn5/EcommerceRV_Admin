import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/management-app/admin/locations/services/location.service';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { ReportService } from '../../services/report.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-physical-inventory-report',
  templateUrl: './physical-inventory-report.component.html',
  styleUrls: ['./physical-inventory-report.component.scss']
})
export class PhysicalInventoryReportComponent implements OnInit {
  public reportId = ReportsEnum.PhysicalInventoryReport;
  public locations: Location[] = [];
  public locationId: number = 0;

  constructor(
    private reportService: ReportService,
    private toastrService: NbToastrService,
    private locationService: LocationService,
    private pdfService: PdfService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.internetConnectionService.verifyInternetConnection();
    this.locationService.listLocations().subscribe(locations => {
      this.locations = locations;
      if (this.locations.length > 0) {
        this.locationId = this.locations[0].id;
      }
      this.spinner.hide();
    });
  }

  getPdf() {
    this.spinner.show();
    this.reportService.getPdf(new Date, new Date, this.reportId, 0, parseInt(this.locationId.toString())).subscribe(pdf => {
      this.pdfService.Open(pdf);
      this.spinner.hide();
    },
      (error) => {
        this.toastrService.danger("", 'Error');
        this.spinner.hide();
      });
  }

  getExcel() {
    this.spinner.show();
    this.reportService.getExcel(new Date, new Date, this.reportId, 0, parseInt(this.locationId.toString())).subscribe(excel => {
      let url = window.URL.createObjectURL(excel);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'registros-de-caja.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.spinner.hide();
    });
  }
}
