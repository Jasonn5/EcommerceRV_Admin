import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditEditorComponent } from './components/credit-editor/credit-editor.component';
import { AddPaymentModalComponent, ViewCreditsComponent } from './components/view-credits/view-credits.component';
import { UpdatePaymentModalComponent, ViewPaymentsComponent } from './components/view-payments/view-payments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CreditDatastoreService } from './services/credit-datastore.service';
import { CreditService } from './services/credit.service';
import { PaymentDatastoreService } from './services/payment-datastore.service';
import { PaymentService } from './services/payment.service';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { ClientsModule } from '../clients/clients.module';

@NgModule({
  declarations: [CreditEditorComponent, ViewCreditsComponent, ViewPaymentsComponent, AddPaymentModalComponent, UpdatePaymentModalComponent],
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
    ClientsModule,
    AppRoutingModule
  ],
  providers: [
    CreditDatastoreService,
    CreditService,
    PaymentDatastoreService,
    PaymentService
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent,
    AddPaymentModalComponent,
    ViewPaymentsComponent,
    UpdatePaymentModalComponent
  ]
})
export class CreditsModule { }
