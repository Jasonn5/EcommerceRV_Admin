import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMerchandiseComponent, EditMerchandiseDetailModalComponent } from './components/add-merchandise/add-merchandise.component';
import { AddStockComponent } from './components/add-stock/add-stock.component';
import { ProductEditorComponent } from './components/product-editor/product-editor.component';
import { SearchProductComponent } from './components/search-product/search-product.component';
import { UpdateMerchandiseRegisterComponent } from './components/update-merchandise-register/update-merchandise-register.component';
import { ViewMerchandiseRegistersComponent } from './components/view-merchandise-registers/view-merchandise-registers.component';
import { ViewProductsComponent } from './components/view-products/view-products.component';
import { MerchandiseDetailTableComponent } from './components/add-merchandise/merchandise-detail-table/merchandise-detail-table.component';
import { ProductsToTransferTableComponent } from './components/add-stock/products-to-transfer-table/products-to-transfer-table.component';
import { StockProductsTableComponent } from './components/add-stock/stock-products-table/stock-products-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ProductDatastoreService } from './services/product-datastore.service';
import { ProductService } from './services/product.service';
import { StockService } from './services/stock.service';
import { StockDatastoreService } from './services/stock-datastore.service';
import { MerchandiseRegisterService } from './services/merchandise-register.service';
import { MerchandiseRegisterDatastoreService } from './services/merchandise-register-datastore.service';
import { NotificationDatastoreService } from './services/notification-datastore.service';
import { NotificationService } from './services/notification.service';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { ViewMerchandiseRegisterDetailComponent } from './components/view-merchandise-registers/view-merchandise-register-detail/view-merchandise-register-detail.component';
import { TransferStocksBetweenLocationsComponent } from './components/transfer-stocks-between-locations/transfer-stocks-between-locations.component';
import { StockOriginComponent } from './components/transfer-stocks-between-locations/stock-origin/stock-origin.component';
import { DestinationStockComponent } from './components/transfer-stocks-between-locations/destination-stock/destination-stock.component';

@NgModule({
  declarations: [AddMerchandiseComponent, AddStockComponent, ProductEditorComponent, SearchProductComponent, UpdateMerchandiseRegisterComponent, ViewMerchandiseRegistersComponent, ViewProductsComponent, MerchandiseDetailTableComponent, ProductsToTransferTableComponent, StockProductsTableComponent, EditMerchandiseDetailModalComponent, ViewMerchandiseRegisterDetailComponent, TransferStocksBetweenLocationsComponent, StockOriginComponent, DestinationStockComponent],
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
  exports: [
    SearchProductComponent
  ],
  providers: [
    ProductDatastoreService,
    ProductService,
    StockService,
    StockDatastoreService,
    MerchandiseRegisterDatastoreService,
    MerchandiseRegisterService,
    NotificationDatastoreService,
    NotificationService
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent,
    EditMerchandiseDetailModalComponent,
    ViewMerchandiseRegisterDetailComponent
  ]
})
export class ProductsModule { }
