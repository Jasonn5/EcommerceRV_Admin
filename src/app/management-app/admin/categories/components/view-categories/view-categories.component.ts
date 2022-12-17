import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { Category } from 'src/app/models/category';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { CategoryService } from '../../services/category.service';
import { localeEs } from 'src/assets/locale.es.js';
import { IconRendererComponent } from 'src/app/management-app/components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from 'src/app/management-app/components/confirmation-modal/confirmation-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.scss']
})
export class ViewCategoriesComponent implements OnInit {
  public categories: Category[] = [];
  public gridOptions: GridOptions;
  public frameworkComponents: any;
  public modalOptions: NgbModalOptions;
  public columnDefs;

  constructor(
    private categoryService: CategoryService,
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

    this.categoryService.listCategories().subscribe(categories => {
      this.categories = categories;
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
          onClick: this.editCategory.bind(this),
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
          onClick: this.deleteCategory.bind(this),
          label: 'trash-2-outline',
          tooltip: 'Eliminar',
          alwaysDisplayIcon: true
        },
        width: 60,
        minWidth: 60
      }
    ];
  }

  deleteCategory(category): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, this.modalOptions);
    modalRef.componentInstance.message = `¿Está seguro de eliminar la categoría ${category.rowData.name}?`;
    modalRef.componentInstance.title = "Eliminar categoría";
    modalRef.result.then((result) => {
      if (result) {
        this.spinner.show();
        var categories = this.categories.find(p => p.id == category.rowData.id);
        var index = this.categories.indexOf(categories);

        if (index > -1) {
          this.categoryService.deleteCategory(category.rowData.id).subscribe(() => {
            this.categories.splice(index, 1);
            this.toastrService.primary('Categoría Eliminada', 'Éxito');
            this.gridOptions.api.setRowData(this.categories);
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

  editCategory(e) {
    this.ngZone.run(() => this.router.navigate(['/admin/edit-category', e.rowData.id])).then();;
  }
}
