import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Client } from 'src/app/models/client';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { CreditService } from '../../services/credit.service';

@Component({
  selector: 'app-credit-editor',
  templateUrl: './credit-editor.component.html',
  styleUrls: ['./credit-editor.component.scss']
})
export class CreditEditorComponent implements OnInit {
  public creditEditorForm: FormGroup;
  public currentDate: NgbDate;
  public selectedClient: Client;
  public isFromSale: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private creditService: CreditService,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    private internetConnectionService: InternetConnectionService,
    private datepipe: DatePipe,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.currentDate = this.calendar.getToday();
    const currentDate = new Date();
    this.config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() }
    this.buildForm();
  }

  private buildForm() {
    this.creditEditorForm = this.formBuilder.group({
      totalAmount: ['', [Validators.required, Validators.pattern(/^(0|[1-9]\d*)?[.]?(0|[1-9]\d*)$/)]],
      creditDate: [this.currentDate]
    });
  }

  creditEditor() {
    this.spinner.show();
    var credit = this.creditEditorForm.value;
    var date = new Date(credit.creditDate.year, credit.creditDate.month - 1, credit.creditDate.day, 0, 0, 0);
    credit.creditDate = this.datepipe.transform(date, "yyyy-MM-dd");
    this.sendCreditData(credit, this.selectedClient);
  }

  sendCreditData(credit, client) {
    this.creditService.addCredit(credit, client).subscribe(() => {
      this.toastrService.primary('Crédito registrado', 'Éxito');
      this.spinner.hide();
      this.creditEditorForm.reset();
      this.selectedClient = null;
      this.buildForm();
    });
  }

  selectClient(client: Client) {
    this.selectedClient = client;
  }

  get totalAmount() {
    return this.creditEditorForm.get('totalAmount');
  }

  get creditDate() {
    return this.creditEditorForm.get('creditDate');
  }

  get clientId() {
    return this.creditEditorForm.get('clientId');
  }
}
