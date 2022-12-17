import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { SubCategory } from 'src/app/models/sub-category';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { SubCategoryService } from '../../services/sub-category.service';
import { localeEs } from 'src/assets/locale.es.js';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-sub-categories',
  templateUrl: './view-sub-categories.component.html',
  styleUrls: ['./view-sub-categories.component.scss']
})
export class ViewSubCategoriesComponent implements OnInit {
  public subCategories: SubCategory[] = [];
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public columnDefs;

  constructor(
    private subCategoryService: SubCategoryService,
    private modalService: NgbModal,
    private router: Router,
    private ngZone: NgZone,
    private toastrService: NbToastrService,
    private internetConnectionService: InternetConnectionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.internetConnectionService.verifyInternetConnection();
    this.spinner.show();

    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };

    this.loadData();

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'sm',
      centered: true
    }

    this.subCategoryService.listSubCategories().subscribe(subCategories => {
      this.subCategories = subCategories;
      this.spinner.hide();
    });
  }

  loadData() {
    this.gridOptions = {
      domLayout: 'autoHeight',
      pagination: true,
      paginationPageSize: 20,
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
        headerName: 'Descripción',
        valueFormatter: (params) => { return params.data.description; },
        minWidth: 250
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.editSubCategory.bind(this),
          label: 'edit-2-outline',
          tooltip: 'Editar',
          alwaysDisplayIcon: true
        },
        width: 40,
        minWidth: 40
      },
      {
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onClick: this.deleteSubCategory.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 40,
        minWidth: 40
      }
    ];
  }

  deleteSubCategory(subCategory): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar la sub categoría ${subCategory.rowData.name}?`;
    modalRef.componentInstance.title = "Eliminar subcategoría";
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var subCategories = this.subCategories.find(p => p.id == subCategory.rowData.id);
        var index = this.subCategories.indexOf(subCategories);

        if (index > -1) {
          this.subCategoryService.deleteCategory(subCategory.rowData.id).subscribe(() => {
            this.subCategories.splice(index, 1);
            this.toastrService.primary('Subcategoría Eliminada', 'Éxito');
            this.gridOptions.api.setRowData(this.subCategories);
            this.spinner.hide();
          },
            error => {
              this.toastrService.danger(error.error.error.message, 'Error')
              this.spinner.hide();
            });
        }
      }
    });
  }

  editSubCategory(e) {
    this.ngZone.run(() => this.router.navigate(['/admin/edit-sub-category', e.rowData.id])).then();;
  }
}
