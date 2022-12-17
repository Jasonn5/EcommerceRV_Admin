import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Client } from 'src/app/models/client';
import { Credit } from 'src/app/models/credit';
import { Payment } from 'src/app/models/payment';
import { environment } from 'src/environments/environment';
import { PaymentDatastoreService } from './payment-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private paymentDatastoreService: PaymentDatastoreService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public addPayment(amount, paymentDate, credit: Credit, client: Client, reference: string) {
    let newPayment = new Payment();
    newPayment.amount = parseFloat(amount);
    newPayment.paymentDate = paymentDate;
    newPayment.reference = reference;
    newPayment.credit = credit;
    newPayment.client = client;

    return this.paymentDatastoreService.add(newPayment);
  }

  public updatePayment(paymentToEdit: Payment, amount, paymentDate, credit: Credit, reference: string) {
    paymentToEdit.amount = parseFloat(amount);
    paymentToEdit.paymentDate = paymentDate;
    paymentToEdit.reference = reference;
    paymentToEdit.credit = credit;

    return this.paymentDatastoreService.update(paymentToEdit);
  }

  public listPaymentsByCreditId(creditId: number) {
    return this.paymentDatastoreService.list(creditId);
  }

  public findById(id) {
    return this.paymentDatastoreService.findById(id);
  }

  public deletePayment(id) {
    return this.paymentDatastoreService.delete(id);
  }

  getPaymentReceipt(paymentId: number) {
    var url = environment.BACK_END_HOST + 'payments/print-payment-receipt';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf').set('Authorization', 'bearer ' + this.authService.getToken());

    return this.http.post(url, { paymentId }, { headers: headers, responseType: 'blob' });
  }
}
