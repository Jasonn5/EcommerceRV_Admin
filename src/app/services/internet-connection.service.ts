import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgConnection } from 'ng-connection';
import { InternetConnectionModalComponent } from '../management-app/components/internet-connection-modal/internet-connection-modal.component';

@Injectable({
  providedIn: 'root'
})
export class InternetConnectionService {
  public modalOptions: NgbModalOptions;
  public modalRef;

  constructor(
    private ngConnection: NgConnection,
    private modalService: NgbModal
  ) { }

  public verifyInternetConnection() {
    this.ngConnection.connectivity().subscribe(status => {
      if (!status) {
        this.internetConnectionDialog();
      }
    });
  }

  internetConnectionDialog() {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    }

    this.modalRef = this.modalService.open(InternetConnectionModalComponent, this.modalOptions);
    this.modalRef.componentInstance.title = 'Error en la conexión';
    this.modalRef.componentInstance.message = 'Verifique su conexión a internet';
  }
}
