import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDatepickerConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { SaleConfigurationService } from 'src/app/management-app/admin/services/sale-configuration.service';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { SaleService } from 'src/app/management-app/sales/services/sale.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { Bill } from 'src/app/models/bill';
import { BillDetail } from 'src/app/models/bill-detail';
import { Sale } from 'src/app/models/sale';
import { SaleConfiguration } from 'src/app/models/sale-configuration';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss']
})
export class AddBillComponent implements OnInit {
  public billDate: NgbDate;
  public taxPaidName: string = '';
  public nit: string = '';
  public sale: Sale;
  public billDetails: BillDetail[] = [];
  public billDetailId = -1;
  public reloadbillDetails: Subject<boolean> = new Subject<boolean>();
  public modalOptions: NgbModalOptions;
  public bills: Bill[] = [];
  public reloadBills: Subject<boolean> = new Subject<boolean>();
  public saleConfiguration: SaleConfiguration = new SaleConfiguration();
  public billConfigurationName: string = '';
  public emissionLimitDate;
  public showWarning: boolean = false;

  constructor(
    private saleService: SaleService,
    private billService: BillService,
    private saleConfigurationService: SaleConfigurationService,
    private authService: AuthService,
    private toastrService: NbToastrService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private pdfService: PdfService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      centered: true
    }
    this.billDate = this.calendar.getToday();
    const currentDate = new Date();
    this.config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() }
    this.getBillsBySale();
    this.getSaleAndFillBillDetails();
    this.saleConfigurationService.getConfiguration(this.authService.getUsername()).subscribe(configuration => {
      this.billConfigurationName = configuration.billConfiguration != null ? configuration.billConfiguration.name : "NINGUNA";
      this.emissionLimitDate = configuration.billConfiguration != null ? configuration.billConfiguration.emissionLimitDate : '';
      this.showWarning = configuration.billConfiguration != null ? this.warningEmissionLimitDate(new Date(configuration.billConfiguration.emissionLimitDate)) : false;
    });
  }

  warningEmissionLimitDate(emissionLimitDate: Date) {
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    var differenceInDays = (emissionLimitDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);

    return differenceInDays <= 14;
  }

  addBill() {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Factura';
    modalRef.componentInstance.message = '¿Desea generar la factura?';
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var date = new Date(this.billDate.year, this.billDate.month - 1, this.billDate.day, 0, 0, 0);
        var billDate = this.datepipe.transform(date, "yyyy-MM-dd");
        this.billService.addBill(this.billDetails, this.sale, billDate, this.taxPaidName, this.nit).subscribe(bill => {
          this.toastrService.primary('Factura registrada', 'Éxito');
          this.bills = [];
          this.billDetails = [];
          this.getBillsBySale();
          this.getSaleAndFillBillDetails();
          this.saleService.printBill(bill.id, false).subscribe(pdf => {
            this.pdfService.Open(pdf);
            this.spinner.hide();
          });
        },
          (error) => {
            this.toastrService.danger(error.error.error.message, 'Error');
            this.spinner.hide();
          });
      }
    });
  }

  getSaleAndFillBillDetails() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.spinner.show();
        this.saleService.findById(params['id']).subscribe(sale => {
          this.sale = sale;
          this.taxPaidName = sale.client != null ? sale.client.name : "Sin nombre";
          this.nit = sale.client != null ? sale.client.nit.toString() : '0';
          sale.saleDetails.forEach(sd => {
            var newBillDetail = new BillDetail();
            newBillDetail.id = this.billDetailId;
            newBillDetail.productName = sd.productName;
            newBillDetail.quantity = sd.quantity;
            newBillDetail.unitaryPrice = sd.unitaryPrice;
            newBillDetail.totalPrice = sd.totalPrice;
            this.billDetails.push(newBillDetail);
            this.billDetailId--;
          });
          this.spinner.hide();
          this.reloadbillDetails.next(true);
        });
      }
    });
  }

  getBillsBySale() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.spinner.show();
        this.billService.listBillsBySale(params['id']).subscribe(bills => {
          this.bills = bills;
          this.spinner.hide();
          this.reloadBills.next(true);
        });
      }
    });
  }

  editBillDetail(billDetail: BillDetail) {
    this.modalOptions.size = 'md';
    const modalRef = this.modalService.open(EditBillDetailModalComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      productName: billDetail.productName,
      unitaryPrice: billDetail.unitaryPrice,
      quantity: billDetail.quantity
    };
    modalRef.result.then((result) => {
      if (result) {
        billDetail.productName = result.productName;
        billDetail.unitaryPrice = result.unitaryPrice;
        billDetail.quantity = result.quantity;
        billDetail.totalPrice = billDetail.unitaryPrice * billDetail.quantity;
        this.reloadbillDetails.next(true);
      }
    });
    this.reloadbillDetails.next(true);
  }

  removeBillDetail(billDetail: BillDetail) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Remover producto';
    modalRef.componentInstance.message = '¿Desea remover el producto ' + billDetail.productName + '?';
    modalRef.result.then((result) => {
      if (result) {
        var index = this.billDetails.indexOf(billDetail);
        if (index > -1) {
          this.billDetails.splice(index, 1);
        }
        this.reloadbillDetails.next(true);
      }
    });
    this.reloadbillDetails.next(true);
  }
}

@Component({
  selector: 'app-edit-bill-detail-modal',
  templateUrl: './edit-bill-detail-modal.component.html',
  styleUrls: ['./edit-bill-detail-modal.component.scss']
})
export class EditBillDetailModalComponent {
  @Input() public data: any;

  constructor(public activeModal: NgbActiveModal) { }

  onYesClick() {
    this.activeModal.close(this.data);
  }
}