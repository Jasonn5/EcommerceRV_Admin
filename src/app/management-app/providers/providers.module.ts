import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderBillEditorComponent } from './components/provider-bill-editor/provider-bill-editor.component';
import { ProviderEditorComponent } from './components/provider-editor/provider-editor.component';
import { ViewProvidersComponent } from './components/view-providers/view-providers.component';
import { ViewProviderBillsComponent } from './components/view-provider-bills/view-provider-bills.component';
import { ProviderDatastoreService } from './services/provider-datastore.service';
import { ProviderService } from './services/provider.service';
import { ProviderBillService } from './services/provider-bill.service';
import { ProviderBillDatastoreService } from './services/provider-bill-datastore.service';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [ProviderBillEditorComponent, ProviderEditorComponent, ViewProvidersComponent, ViewProviderBillsComponent],
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
    ProviderDatastoreService,
    ProviderService,
    ProviderBillService,
    ProviderBillDatastoreService
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent
  ]
})
export class ProvidersModule { }
