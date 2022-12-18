import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { Product } from 'src/app/models/product';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { UploadService } from 'src/app/services/upload.service';
import { ProductService } from '../../services/product.service';
import { localeEs } from 'src/assets/locale.es.js';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss']
})
export class ViewProductsComponent implements OnInit {
  @ViewChild('searchRef', { static: true }) searchRef: ElementRef;
  public searchIsEmpty: boolean = true;
  public products: Product[] = [];
  public columnDefs;
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public folderName: string = "productos";
  public quickSearchValue: string = '';
  public modalOptions: NgbModalOptions;

  constructor(
    private productService: ProductService,
    private uploadService: UploadService,
    private modalService: NgbModal,
    private ngZone: NgZone,
    private toastrService: NbToastrService,
    private router: Router,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    };

    this.searchProducts('');
    this.loadData();

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    }

    fromEvent(this.searchRef.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    ).subscribe(text => {
      this.searchProducts(text);
    });
  }

  importExcel(event) {
    let file = event.target.files;

    if (file[0] != null) {
      this.spinner.show();
      this.productService.importExcel(file[0]).subscribe(
        (result) => {
          this.toastrService.primary("Productos Agregados Exitosamente", 'Exito');
          this.searchProducts('');
          this.spinner.hide();
        },
        (error) => {
          this.toastrService.danger("", 'Error');
          this.spinner.hide();
        }
      );
    }
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 15,
      onGridReady: (params) => {
        params.api.sizeColumnsToFit();
        params.api.collapseAll();
      },
      onGridSizeChanged: (params) => {
        params.api.collapseAll();
      },
      defaultColDef: {
        resizable: true
      },
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }

    this.columnDefs = [
      {
        headerName: 'Nombre',
        valueFormatter: (params) => { return params.data.name; },
        minWidth: 250
      },
      {
        headerName: 'Precio de venta (Bs.)',
        valueFormatter: (params) => { return Number(params.data.price).toFixed(2); },
        minWidth: 100
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.sendJobOrderId.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Editar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.deleteProduct.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  searchProducts(value: string) {
    this.spinner.show();
    this.productService.searchProducts(value).subscribe(products => {
      this.products = products;
      this.searchIsEmpty = value == '';
      this.spinner.hide();
    });
  }

  deleteProduct(e): void {
    var imageUrl = e.rowData.imageUrl;
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar el producto ${e.rowData.name}?`;
    modalRef.componentInstance.title = "Eliminar producto";
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var products = this.products.find(p => p.id == e.rowData.id);
        var index = this.products.indexOf(products);

        if (index > -1) {
          this.productService.deleteProduct(products.id).subscribe(() => {
            this.products.splice(index, 1);
            this.toastrService.primary('Producto Eliminado.', 'Éxito');
            this.gridOptions.api.setRowData(this.products);
            this.spinner.hide();
          },
            error => {
              this.toastrService.danger(error.error.error.message, 'Error')
              this.spinner.hide();
            });;
        }
        if (imageUrl) {
          this.uploadService.deleteFile(imageUrl, this.folderName);
        }
      }
    });
  }

  sendJobOrderId(e) {
    this.ngZone.run(() => this.router.navigate(['/products/edit-product', e.rowData.id])).then();
  }
}
