import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { CashRegister } from 'src/app/models/cash-register';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { TypePipe } from '../../pipes/cash-register-type';
import { CashRegisterService } from '../../services/cash-register.service';
import { AddEntryComponent } from '../add-entry/add-entry.component';
import { ViewCashRegisterEntriesComponent } from '../view-cash-register-entries/view-cash-register-entries.component';

@Component({
  selector: 'app-cash-register-dashboard',
  templateUrl: './cash-register-dashboard.component.html',
  styleUrls: ['./cash-register-dashboard.component.scss']
})
export class CashRegisterDashboardComponent implements OnInit {
  public listCashRegisters: CashRegister[] = [];
  public modalOptions: NgbModalOptions;

  constructor(
    private cashRegisterService: CashRegisterService,
    private router: Router,
    private type: TypePipe,
    private modalService: NgbModal,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService,
    private toastrService: NbToastrService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.internetConnectionService.verifyInternetConnection();
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      centered: true
    }
    this.cashRegisterService.listCashRegisters().subscribe(cashRegisters => {
      this.listCashRegisters = cashRegisters;
      this.spinner.hide();
    });
  }

  addEntryDialog(cashRegister: CashRegister) {
    this.modalOptions.size = 'md';
    const modalRef = this.modalService.open(AddEntryComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      id: cashRegister.id,
      code: cashRegister.code,
      amount: cashRegister.amount
    };
    modalRef.result.then((result) => {
      if (!result) {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      }
    });
  }

  viewEntriesDialog(cashRegisterId: number) {
    this.modalOptions.size = 'xl';
    const modalRef = this.modalService.open(ViewCashRegisterEntriesComponent, this.modalOptions);
    modalRef.componentInstance.cashRegisterId = cashRegisterId;
    modalRef.result.then((result) => {
      if (!result) {
        this.spinner.show();
        this.cashRegisterService.listCashRegisters().subscribe(cashRegisters => {
          this.listCashRegisters = cashRegisters;
          this.spinner.hide();
        });
      }
    });
  }

  deleteCashRegister(event) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar la cuenta ${event.code}?`;
    modalRef.componentInstance.title = "Eliminar cuenta";
    modalRef.result.then((result) => {
      if (result) {
        var cashRegister = this.listCashRegisters.find(ta => ta.id == event.id);
        var index = this.listCashRegisters.indexOf(cashRegister);
        if (index > -1) {
          this.spinner.show();
          this.cashRegisterService.deleteCashRegister(event.id).subscribe(success => {
              this.listCashRegisters.splice(index, 1);
              this.toastrService.primary('Cuenta Eliminada.', 'Éxito');
              this.spinner.hide();
            }, (error) => {
              this.toastrService.danger(error.error.error.message, 'Error');
              this.spinner.hide();
            }
          );
        }
      }
    });
  }
}
