import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbCalendar, NgbDate, NgbDatepickerConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
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
import { MerchandiseRegister } from 'src/app/models/merchandise-register';
import { Product } from 'src/app/models/product';
import { Provider } from 'src/app/models/provider';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { UploadService } from 'src/app/services/upload.service';
import { MerchandiseRegisterService } from '../../services/merchandise-register.service';
import { EditMerchandiseDetailModalComponent } from '../add-merchandise/add-merchandise.component';

@Component({
  selector: 'app-update-merchandise-register',
  templateUrl: './update-merchandise-register.component.html',
  styleUrls: ['./update-merchandise-register.component.scss']
})
export class UpdateMerchandiseRegisterComponent implements OnInit {
  public merchandiseRegister: MerchandiseRegister;
  public merchandiseDetails: MerchandiseDetail[] = [];
  public reloadMerchandiseDetail: Subject<boolean> = new Subject<boolean>();
  private merchandiseDetailId: number;
  public registerDate: NgbDate;
  public locations: Location[] = [];
  public selectedLocation: Location;
  public locationId: number = 0;
  public providers: Provider[] = [];
  public selectedProvider: Provider;
  public providerId: number = 0;
  public billNumber: string;
  public billUrl;
  public currentFileName = null;
  public newFileName = null;
  public nameFile;
  public file: File;
  private FILE_MAX_SIZE = 2097000;
  public fileErrorSize = null;
  public folderName: string = "Facturas";
  public date: Date;
  public modalOptions: NgbModalOptions;
  public reloadProducts: Subject<boolean> = new Subject<boolean>();

  constructor(
    private merchandiseRegisterService: MerchandiseRegisterService,
    private locationService: LocationService,
    private providerService: ProviderService,
    private internetConnectionService: InternetConnectionService,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    private modalService: NgbModal,
    private toastrService: NbToastrService,
    private reportService: ReportService,
    private cd: ChangeDetectorRef,
    private uploadService: UploadService,
    private pdfService: PdfService,
    private config: NgbDatepickerConfig,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.merchandiseRegister = new MerchandiseRegister();
    this.merchandiseDetails = [];
    this.locations = [];
    this.providers = [];
    this.merchandiseDetailId = 0;
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      centered: true
    }

    const currentDate = new Date();
    this.config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() }
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.merchandiseRegisterService.findById(params['id']).subscribe(merchandiseRegister => {
          this.merchandiseRegister = merchandiseRegister;
          this.registerDate = this.calendar.getToday();
          this.date = new Date(this.merchandiseRegister.registerDate);
          this.registerDate.year = this.date.getFullYear();
          this.registerDate.month = this.date.getMonth() + 1;
          this.registerDate.day = this.date.getUTCDate();
          this.billNumber = this.merchandiseRegister.billNumber;
          this.currentFileName = this.merchandiseRegister.billUrl;
          this.newFileName = this.merchandiseRegister.billUrl;
          this.locationId = this.merchandiseRegister.location.id != null ? this.merchandiseRegister.location.id : 0;
          this.providerId = this.merchandiseRegister.provider.id != null ? this.merchandiseRegister.provider.id : 0;
          this.merchandiseRegister.merchandiseDetails.forEach(md => {
            var newMerchandiseDetail = new MerchandiseDetail();
            newMerchandiseDetail.productId = md.productId;
            newMerchandiseDetail.productName = md.productName;
            newMerchandiseDetail.productCode = md.productCode;
            newMerchandiseDetail.price = md.price;
            newMerchandiseDetail.quantity = md.quantity;
            //@ts-ignore
            newMerchandiseDetail.id = md.id;
            this.merchandiseDetails.push(newMerchandiseDetail);
          });
          this.reloadMerchandiseDetail.next(true);
          var fileName = this.currentFileName.split('/').reverse();
          this.nameFile = fileName[0];
        });
      }
    });

    this.locationService.listLocations().subscribe(locations => {
      this.locations = locations;
    });

    this.providerService.searchProviders('').subscribe(providers => {
      this.providers = providers;
    });
  }

  updateMerchandise() {
    this.modalOptions.size = 'sm';
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.title = 'Actualizacion de mercadería';
    modalRef.componentInstance.message = '¿Desea actualizar la mercadería?';
    modalRef.result.then((result) => {
      if (result) {
        var component = this;
        if (this.file) {
          this.uploadService.uploadFile(this.file, this.folderName)
            .then(function (data) {
              component.billUrl = data.Location;
              component.spinner.show();
              var date = new Date(component.registerDate.year, component.registerDate.month - 1, component.registerDate.day);
              component.selectedLocation = component.locations.find(l => l.id == component.locationId);
              component.selectedProvider = component.providerId != 0 ? component.providers.find(p => p.id == component.providerId) : null;
              component.merchandiseRegisterService.updateMerchandiseRegister(component.merchandiseRegister, component.merchandiseDetails, component.selectedLocation, date, component.selectedProvider, component.billNumber, component.billUrl).subscribe(() => {
                if ((component.currentFileName != component.newFileName) && component.currentFileName != null) {
                  component.uploadService.deleteFile(component.newFileName, component.folderName);
                }
                component.toastrService.primary('Información actualizada', 'Éxito', {});
                component.reportService.getPdf(new Date, new Date, ReportsEnum.MerchandiseRegisterReport, 0, 0, 0, component.merchandiseRegister.id).subscribe(pdf => {
                  component.pdfService.Open(pdf);
                  component.spinner.hide();
                });
              },
                (error) => {
                  component.spinner.hide();
                  component.toastrService.danger(error.error.message, 'Error')
                });
            })
        } else {
          this.spinner.show();
          this.billUrl = this.currentFileName ? this.currentFileName : null;
          var date = new Date(this.registerDate.year, this.registerDate.month - 1, this.registerDate.day);
          this.selectedLocation = this.locations.find(l => l.id == this.locationId);
          this.selectedProvider = this.providerId != 0 ? this.providers.find(p => p.id == this.providerId) : null;
          this.billNumber = this.billNumber != '' ? this.billNumber : '0';
          this.merchandiseRegisterService.updateMerchandiseRegister(this.merchandiseRegister, this.merchandiseDetails, this.selectedLocation, date, this.selectedProvider, this.billNumber, this.billUrl).subscribe(() => {
            this.toastrService.primary('Información actualizada', 'Éxito', {});
            this.reportService.getPdf(new Date, new Date, ReportsEnum.MerchandiseRegisterReport, 0, 0, 0, this.merchandiseRegister.id).subscribe(pdf => {
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
      this.nameFile = event.target.files[0].name;
      console.log(this.nameFile)
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
