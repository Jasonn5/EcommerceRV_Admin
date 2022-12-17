import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { LocationService } from 'src/app/management-app/admin/locations/services/location.service';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { ProviderService } from 'src/app/management-app/providers/services/provider.service';
import { ReportService } from 'src/app/management-app/reports/services/report.service';
import { PdfService } from 'src/app/management-app/services/pdf.service';
import { ReportsEnum } from 'src/app/models/enums/reports-enum';
import { Location } from 'src/app/models/location';
import { MerchandiseDetail } from 'src/app/models/merchandise-detail';
import { Product } from 'src/app/models/product';
import { Provider } from 'src/app/models/provider';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { UploadService } from 'src/app/services/upload.service';
import { MerchandiseRegisterService } from '../../services/merchandise-register.service';

@Component({
  selector: 'app-add-merchandise',
  templateUrl: './add-merchandise.component.html',
  styleUrls: ['./add-merchandise.component.scss']
})
export class AddMerchandiseComponent implements OnInit {
  public merchandiseDetails: MerchandiseDetail[] = [];
  private merchandiseDetailId: number;
  public reloadMerchandiseDetail: Subject<boolean> = new Subject<boolean>();
  public modalOptions: NgbModalOptions;
  public registerDate: NgbDate;
  public locations: Location[] = [];
  public selectedLocation: Location;
  public locationId: number = 0;
  public providers: Provider[] = [];
  public selectedProvider: Provider;
  public providerId: number = 0;
  public billNumber: string = '';
  public billUrl;
  public file: File;
  private FILE_MAX_SIZE = 2097000;
  public fileErrorSize = null;
  public currentFileName = null;
  public folderName: string = "Facturas";
  public reloadProducts: Subject<boolean> = new Subject<boolean>();
  public generateExpense: boolean = false;

  constructor(
    private merchandiseRegisterService: MerchandiseRegisterService,
    private locationService: LocationService,
    private providerService: ProviderService,
    private toastrService: NbToastrService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private reportService: ReportService,
    private cd: ChangeDetectorRef,
    private uploadService: UploadService,
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
    this.selectedProvider = null;
    this.registerDate = this.calendar.getToday();
    this.merchandiseDetailId = 0;
    this.merchandiseDetails = [];
    this.spinner.show();
    this.locationService.listLocations().subscribe(locations => {
      this.locations = locations;
      if (this.locations.length > 0) {
        this.locationId = this.locations[0].id;
        this.selectedLocation = this.locations[0]
      }
      this.spinner.hide();
    });

    this.providerService.searchProviders('').subscribe(providers => {
      this.providers = providers;
      this.spinner.hide();
    });
  }

  addMerchandise() {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Ingreso de mercadería';
    modalRef.componentInstance.message = '¿Desea registrar la mercadería?';
    modalRef.result.then((result) => {
      if (result) {
        this.billNumber = this.billNumber != '' ? this.billNumber : '0';
        var component = this;
        if (this.file) {
          component.spinner.show();
          this.uploadService.uploadFile(this.file, this.folderName)
            .then(function (data) {
              component.billUrl = data.Location;
              var date = new Date(component.registerDate.year, component.registerDate.month - 1, component.registerDate.day);
              component.merchandiseRegisterService.addMerchandiseRegister(component.merchandiseDetails, component.selectedLocation, date, component.selectedProvider, component.billNumber, component.billUrl, component.generateExpense).subscribe(merchandiseRegister => {
                component.toastrService.show('Mercadería registrada', 'Éxito', {});
                component.merchandiseDetails = [];
                component.registerDate = component.calendar.getToday();
                component.billNumber = '';
                component.billUrl = '';
                component.reloadProducts.next(true);
                component.reportService.getPdf(new Date, new Date, ReportsEnum.MerchandiseRegisterReport, 0, 0, 0, merchandiseRegister.id).subscribe(pdf => {
                  component.pdfService.Open(pdf);
                  component.spinner.hide();
                });
              },
                (error) => {
                  component.spinner.hide();
                  component.toastrService.danger(error.error.message, 'Error')
                });
            })
            .catch(function (error) {
              console.log('There was an error uploading your file: ', error);
            });
        }
        else {
          this.spinner.show();
          var date = new Date(this.registerDate.year, this.registerDate.month - 1, this.registerDate.day);
          this.merchandiseRegisterService.addMerchandiseRegister(this.merchandiseDetails, this.selectedLocation, date, this.selectedProvider, this.billNumber, null, this.generateExpense).subscribe(merchandiseRegister => {
            this.toastrService.primary('Mercadería registrada', 'Éxito', {});
            this.merchandiseDetails = [];
            this.registerDate = this.calendar.getToday();
            this.billNumber = '';
            this.billUrl = '';
            this.reloadProducts.next(true);
            this.reportService.getPdf(new Date, new Date, ReportsEnum.MerchandiseRegisterReport, 0, 0, 0, merchandiseRegister.id).subscribe(pdf => {
              this.pdfService.Open(pdf);
              this.spinner.hide();
            });
          },
            (error) => {
              this.spinner.hide();
              this.toastrService.danger(error.error.message, 'Error')
            });
        }
      }
    });
  }

  selectLocation() {
    this.selectedLocation = this.locations.find(l => l.id == this.locationId);
  }

  selectProvider() {
    this.selectedProvider = this.providerId != 0 ? this.providers.find(p => p.id == this.providerId) : null;
  }

  addProductToMerchandiseDetail(product: Product) {
    var newMerchandiseDetail = new MerchandiseDetail();
    newMerchandiseDetail.productId = product.id;
    newMerchandiseDetail.productName = product.displayName;
    newMerchandiseDetail.productCode = product.code;
    newMerchandiseDetail.price = product.price;
    newMerchandiseDetail.quantity = 1;
    this.merchandiseDetailId--;
    //@ts-ignore
    newMerchandiseDetail.id = this.merchandiseDetailId;
    this.merchandiseDetails.push(newMerchandiseDetail);
    this.editMerchandiseDetail(newMerchandiseDetail);
  }

  editMerchandiseDetail(merchandiseDetail: MerchandiseDetail) {
    this.modalOptions.size = 'md';
    const modalRef = this.modalService.open(EditMerchandiseDetailModalComponent, this.modalOptions);
    modalRef.componentInstance.data = {
      merchandiseDetailPrice: merchandiseDetail.price,
      merchandiseDetailQuantity: merchandiseDetail.quantity,
    };
    modalRef.result.then((result) => {
      if (result) {
        merchandiseDetail.price = result.merchandiseDetailPrice;
        merchandiseDetail.quantity = result.merchandiseDetailQuantity;
        this.reloadMerchandiseDetail.next(true);
      }
    });
    this.reloadMerchandiseDetail.next(true);
  }

  removeMerchandiseDetail(merchandiseDetail: MerchandiseDetail) {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Remover producto';
    modalRef.componentInstance.message = '¿Desea remover el producto ' + merchandiseDetail.productName + '?';
    modalRef.result.then((result) => {
      if (result) {
        var index = this.merchandiseDetails.indexOf(merchandiseDetail);
        if (index > -1) {
          this.merchandiseDetails.splice(index, 1);
        }
        this.reloadMerchandiseDetail.next(true);
      }
    });
    this.reloadMerchandiseDetail.next(true);
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      [this.file] = event.target.files;
      const fileSize = this.file.size;
      reader.readAsDataURL(this.file);

      reader.onload = (event: any) => {
        if (fileSize > this.FILE_MAX_SIZE) {
          this.currentFileName = null;
          this.file = null;
          this.fileErrorSize = "El documento no puede exceder el tamaño de 2MB";
        } else {
          this.fileErrorSize = null;
          this.currentFileName = event.target.result;
          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        }
      }
    }
  }

  removeFile() {
    this.file = null;
    this.currentFileName = null;
  }
}

@Component({
  selector: 'app-edit-merchandise-modal',
  templateUrl: './edit-merchandise-modal.component.html',
  styleUrls: ['./edit-merchandise-modal.component.scss']
})
export class EditMerchandiseDetailModalComponent {
  @Input() public data: any;

  constructor(public activeModal: NgbActiveModal) { }

  onYesClick() {
    this.activeModal.close(this.data);
  }
}