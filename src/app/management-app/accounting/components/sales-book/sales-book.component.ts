import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountingEnum } from 'src/app/models/enums/accounting-enum';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { AccountingService } from '../../services/accounting.service';

@Component({
  selector: 'app-sales-book',
  templateUrl: './sales-book.component.html',
  styleUrls: ['./sales-book.component.scss']
})
export class SalesBookComponent implements OnInit {
  public accountingId = AccountingEnum.SALESBOOK;
  public generateExcel: FormGroup;
  public start: NgbDate;
  public end: NgbDate;

  constructor(
    private toastrService: NbToastrService,
    private accountingService: AccountingService,
    private calendar: NgbCalendar,
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

  getExcel() {
    let startDate = new Date(this.start.year, this.start.month - 1, this.start.day);
    let endDate = new Date(this.end.year, this.end.month - 1, this.end.day);
    this.spinner.show();
    this.accountingService.getExcel(startDate, endDate, this.accountingId).subscribe(excel => {
      let url = window.URL.createObjectURL(excel);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'LibroVentas.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.spinner.hide();
    },
      (error) => {
        this.toastrService.danger("", 'Error');
        this.spinner.hide();
      });
  }
}
