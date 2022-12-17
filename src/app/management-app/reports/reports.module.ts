import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientKardexReportComponent } from './components/client-kardex-report/client-kardex-report.component';
import { EntryReportComponent } from './components/entry-report/entry-report.component';
import { ExpenseReportComponent } from './components/expense-report/expense-report.component';
import { PhysicalInventoryReportComponent } from './components/physical-inventory-report/physical-inventory-report.component';
import { ProductKardexReportComponent } from './components/product-kardex-report/product-kardex-report.component';
import { ProductReportComponent } from './components/product-report/product-report.component';
import { SalesByDayReportComponent } from './components/sales-by-day-report/sales-by-day-report.component';
import { SalesBySellerReportComponent } from './components/sales-by-seller-report/sales-by-seller-report.component';
import { SalesReportComponent } from './components/sales-report/sales-report.component';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ProductsModule } from '../products/products.module';
import { ClientsModule } from '../clients/clients.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReportService } from './services/report.service';
import { DetailedSalesReportComponent } from './components/detailed-sales-report/detailed-sales-report.component';
import { SalesVsExpensesGlobalReportComponent } from './components/sales-vs-expenses-global-report/sales-vs-expenses-global-report.component';
import { MerchandiseRegistersReportComponent } from './components/merchandise-registers-report/merchandise-registers-report.component';

@NgModule({
  declarations: [ClientKardexReportComponent, EntryReportComponent, ExpenseReportComponent, PhysicalInventoryReportComponent, ProductKardexReportComponent, ProductReportComponent, SalesByDayReportComponent, SalesBySellerReportComponent, SalesReportComponent, DetailedSalesReportComponent, SalesVsExpensesGlobalReportComponent, MerchandiseRegistersReportComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NgbModule,
    NbSpinnerModule,
    FormsModule,
    NbIconModule,
    ProductsModule,
    ClientsModule,
    AppRoutingModule
  ],
  providers: [
    ReportService
  ]
})
export class ReportsModule { }
