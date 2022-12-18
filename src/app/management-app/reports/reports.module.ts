import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesReportComponent } from './components/sales-report/sales-report.component';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ProductsModule } from '../products/products.module';
import { ClientsModule } from '../clients/clients.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReportService } from './services/report.service';
import { DetailedSalesReportComponent } from './components/detailed-sales-report/detailed-sales-report.component';
import { ProductReportComponent } from './components/product-report/product-report.component';

@NgModule({
  declarations: [SalesReportComponent, DetailedSalesReportComponent, ProductReportComponent],
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
