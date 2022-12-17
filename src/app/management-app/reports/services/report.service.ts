import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private _http: HttpClient) { }

  getPdf(
    startDate: Date,
    endDate: Date,
    reportId: number,
    productId: number = 0,
    locationId: number = 0,
    clientId: number = 0,
    merchandiseRegisterId: number = 0,
    sellerId: number = 0,
    cashRegisterId: number = 0
  ) {
    var url = environment.BACK_END_HOST + 'report/print';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this._http.post(url, { startDate, endDate, reportId, productId, locationId, clientId, merchandiseRegisterId, sellerId, cashRegisterId }, { headers: headers, responseType: 'blob' });
  }

  getExcel(
    startDate: Date,
    endDate: Date,
    reportId: number,
    productId: number = 0,
    locationId: number = 0,
    clientId: number = 0,
    merchandiseRegisterId: number = 0,
    sellerId: number = 0,
    cashRegisterId: number = 0
  )
  {
    var url = environment.BACK_END_HOST + 'excel-export/print';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this._http.post(url, { startDate, endDate, reportId, productId, locationId, clientId, merchandiseRegisterId, sellerId, cashRegisterId }, { headers: headers, responseType: 'blob' });
  }
}
