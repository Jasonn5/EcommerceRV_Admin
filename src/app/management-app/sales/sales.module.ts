import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddSaleComponent, EditSaleDetailDialogComponent } from './components/add-sale/add-sale.component';
import { SaleDetailTableComponent } from './components/add-sale/sale-detail-table/sale-detail-table.component';
import { StockTableComponent } from './components/add-sale/stock-table/stock-table.component';
import { UpdateSaleComponent } from './components/update-sale/update-sale.component';
import { ViewSalesComponent } from './components/view-sales/view-sales.component';
import { ViewSaleDetailComponent } from './components/view-sales/view-sale-detail/view-sale-detail.component';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientsModule } from '../clients/clients.module';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SaleDatastoreService } from './services/sale-datastore.service';
import { SaleService } from './services/sale.service';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { BusinessServiceTableComponent } from './components/add-sale/business-service-table/business-service-table.component';

@NgModule({
  declarations: [AddSaleComponent, SaleDetailTableComponent, StockTableComponent, UpdateSaleComponent, ViewSalesComponent, ViewSaleDetailComponent, EditSaleDetailDialogComponent, BusinessServiceTableComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    NbEvaIconsModule,
    NbIconModule,
    NgbModule,
    ClientsModule,
    AgGridModule.withComponents([]),
    AppRoutingModule
  ],
  providers: [
    SaleDatastoreService,
    SaleService,
    DatePipe
  ],
  entryComponents: [
    EditSaleDetailDialogComponent,
    ConfirmationModalComponent,
    ViewSaleDetailComponent
  ]
})
export class SalesModule { }
