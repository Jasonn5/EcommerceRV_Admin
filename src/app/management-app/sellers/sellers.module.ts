import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerEditorComponent } from './components/seller-editor/seller-editor.component';
import { ViewSellersComponent } from './components/view-sellers/view-sellers.component';
import { SellerDatastoreService } from './services/seller-datastore.service';
import { SellerService } from './services/seller.service';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgGridModule } from 'ag-grid-angular';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [SellerEditorComponent, ViewSellersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NbCardModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSpinnerModule,
    AgGridModule.withComponents([]),
    AgmCoreModule,
    AppRoutingModule
  ],
  providers: [
    SellerDatastoreService,
    SellerService
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent
  ]
})
export class SellersModule { }
