import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderStatusPipe } from './pipes/order-status.pipe';
import { AddOrderComponent, EditOrderDetailDialogComponent } from './components/add-order/add-order.component';
import { OrderDetailTableComponent } from './components/add-order/order-detail-table/order-detail-table.component';
import { StockToOrderTableComponent } from './components/add-order/stock-to-order-table/stock-to-order-table.component';
import { UpdateOrderComponent } from './components/update-order/update-order.component';
import { ViewOrdersComponent } from './components/view-orders/view-orders.component';
import { ViewOrderDetailComponent } from './components/view-orders/view-order-detail/view-order-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgGridModule } from 'ag-grid-angular';
import { ClientsModule } from '../clients/clients.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { OrderDatastoreService } from './services/order-datastore.service';
import { OrderService } from './services/order.service';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { EditPreOrderDetailDialogComponent, PreOrderComponent } from './components/pre-order/pre-order.component';

@NgModule({
  declarations: [OrderStatusPipe, AddOrderComponent, OrderDetailTableComponent, StockToOrderTableComponent, UpdateOrderComponent, ViewOrdersComponent, ViewOrderDetailComponent, EditOrderDetailDialogComponent, PreOrderComponent, EditPreOrderDetailDialogComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbSpinnerModule,
    NbIconModule,
    NbEvaIconsModule,
    AgGridModule.withComponents([]),
    ClientsModule,
    AppRoutingModule,
  ],
  providers: [
    OrderDatastoreService,
    OrderService,
    OrderStatusPipe,
    DatePipe
  ],
  entryComponents: [
    EditOrderDetailDialogComponent,
    IconRendererComponent,
    ViewOrderDetailComponent,
    ConfirmationModalComponent
  ]
})
export class OrdersModule { }
