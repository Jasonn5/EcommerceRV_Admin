import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ManagementAppComponent } from './management-app.component';
import { ManagementAppRoutingModule } from './management-app-routing.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbCardModule, NbIconModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbToastrModule } from '@nebular/theme';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { IconRendererComponent } from './components/icon-renderer/icon-renderer.component';
import { InternetConnectionModalComponent } from './components/internet-connection-modal/internet-connection-modal.component';
import { UsersModule } from './users/users.module';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NotificationsModalComponent } from './components/notifications-modal/notifications-modal.component';
import { MonthToLiteralPipe } from './pipes/month-to-literal.pipe';
import { SharedService } from './services/shared.service';
import { ClientsModule } from './clients/clients.module';
import { SellersModule } from './sellers/sellers.module';
import { ProvidersModule } from './providers/providers.module';
import { CustomDatepickerI18n, I18n } from './datepicker-translate/datepicker-translate';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './datepicker-formatter/datepicker-formatter';
import { CashRegistersModule } from './cash-registers/cash-registers.module';
import { AdminModule } from './admin/admin.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CreditsModule } from './credits/credits.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { SalesModule } from './sales/sales.module';
import { EntriesChartComponent } from './components/home/charts/entries-chart.component';
import { SalesChartComponent } from './components/home/charts/sales-chart.component';
import { ChartModule } from 'angular2-chartjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { AccountingModule } from './accounting/accounting.module';
import { BusinessServicesModule } from './business-services/business-services.module';
import { OrdersModule } from './orders/orders.module';
import { BillingModule } from './billing/billing.module';
import { PdfService } from './services/pdf.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [ManagementAppComponent, HomeComponent, HeaderComponent, IconRendererComponent, InternetConnectionModalComponent, ConfirmationModalComponent, NotFoundComponent, NotificationsModalComponent, MonthToLiteralPipe, EntriesChartComponent, SalesChartComponent],
  imports: [
    CommonModule,
    NbEvaIconsModule,
    NbIconModule,
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbToastrModule.forRoot(),
    NbLayoutModule,
    NbCardModule,
    NgbModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    AccountingModule,
    AdminModule,
    BillingModule,
    BusinessServicesModule,
    CashRegistersModule,
    ClientsModule,
    CreditsModule,
    ExpensesModule,
    OrdersModule,
    ProductsModule,
    ProvidersModule,
    ReportsModule,
    SalesModule,
    SellersModule,
    UsersModule,
    NgxSpinnerModule,
    ManagementAppRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ConfirmationModalComponent,
    InternetConnectionModalComponent,
    NotificationsModalComponent
  ],
  providers: [
    DatePipe,
    MonthToLiteralPipe,
    SharedService,
    PdfService,
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class ManagementAppModule { }
