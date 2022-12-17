import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getExcel(startDate: Date, endDate: Date, accountingId: number) {
    var url = environment.BACK_END_HOST + 'accounting/print-accounting';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').set('Authorization', 'bearer ' + this.authService.getToken());

    return this.http.post(url, { startDate, endDate, accountingId }, { headers: headers, responseType: 'blob' });
  }
}
