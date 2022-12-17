import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingInformationEditorComponent } from './components/billing-information-editor/billing-information-editor.component';
import { ViewBillConfigurationsComponent } from './components/view-bill-configurations/view-bill-configurations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BillConfigurationDatastoreService } from './services/bill-configuration-datastore.service';
import { BillConfigurationService } from './services/bill-configuration.service';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { AddBillComponent, EditBillDetailModalComponent } from './components/add-bill/add-bill.component';
import { ViewBillsBySaleComponent } from './components/add-bill/view-bills-by-sale/view-bills-by-sale.component';
import { BillDetailsTableComponent } from './components/add-bill/bill-details-table/bill-details-table.component';
import { BillDatastoreService } from './services/bill-datastore.service';
import { BillService } from './services/bill.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewBillComponent } from './components/add-bill/view-bill/view-bill.component';

@NgModule({
  declarations: [BillingInformationEditorComponent, ViewBillConfigurationsComponent, AddBillComponent, ViewBillsBySaleComponent, BillDetailsTableComponent, EditBillDetailModalComponent, ViewBillComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NbCardModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSpinnerModule,
    NgbModule,
    AgGridModule.withComponents([]),
    AppRoutingModule
  ],
  providers: [
    BillConfigurationDatastoreService,
    BillConfigurationService,
    BillDatastoreService,
    BillService
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent,
    EditBillDetailModalComponent,
    ViewBillComponent
  ]
})
export class BillingModule { }
