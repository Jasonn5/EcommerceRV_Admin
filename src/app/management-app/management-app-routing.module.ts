import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChangePasswordComponent } from '../authentication/components/change-password/change-password.component';
import { AuthGuardService } from '../authentication/services/auth-guard.service';
import { SalesBookComponent } from './accounting/components/sales-book/sales-book.component';
import { ShoppingBookComponent } from './accounting/components/shopping-book/shopping-book.component';
import { CategoryEditorComponent } from './admin/categories/components/category-editor/category-editor.component';
import { ViewCategoriesComponent } from './admin/categories/components/view-categories/view-categories.component';
import { SaleConfigurationComponent } from './admin/components/sale-configuration/sale-configuration.component';
import { LocationEditorComponent } from './admin/locations/components/location-editor/location-editor.component';
import { ViewLocationsComponent } from './admin/locations/components/view-locations/view-locations.component';
import { SubCategoryEditorComponent } from './admin/sub-categories/components/sub-category-editor/sub-category-editor.component';
import { ViewSubCategoriesComponent } from './admin/sub-categories/components/view-sub-categories/view-sub-categories.component';
import { AddBillComponent } from './billing/components/add-bill/add-bill.component';
import { BillingInformationEditorComponent } from './billing/components/billing-information-editor/billing-information-editor.component';
import { ViewBillConfigurationsComponent } from './billing/components/view-bill-configurations/view-bill-configurations.component';
import { BusinessServiceEditorComponent } from './business-services/components/business-service-editor/business-service-editor.component';
import { ViewBusinessServicesComponent } from './business-services/components/view-business-services/view-business-services.component';
import { CashRegisterDashboardComponent } from './cash-registers/components/cash-register-dashboard/cash-register-dashboard.component';
import { CashRegisterEditorComponent } from './cash-registers/components/cash-register-editor/cash-register-editor.component';
import { ClientEditorComponent } from './clients/components/client-editor/client-editor.component';
import { ViewClientsComponent } from './clients/components/view-clients/view-clients.component';
import { HomeComponent } from './components/home/home.component';
import { CreditEditorComponent } from './credits/components/credit-editor/credit-editor.component';
import { ViewCreditsComponent } from './credits/components/view-credits/view-credits.component';
import { AddExpenseComponent } from './expenses/components/add-expense/add-expense.component';
import { ViewExpensesComponent } from './expenses/components/view-expenses/view-expenses.component';
import { ManagementAppComponent } from './management-app.component';
import { AddOrderComponent } from './orders/components/add-order/add-order.component';
import { PreOrderComponent } from './orders/components/pre-order/pre-order.component';
import { UpdateOrderComponent } from './orders/components/update-order/update-order.component';
import { ViewOrdersComponent } from './orders/components/view-orders/view-orders.component';
import { AddMerchandiseComponent } from './products/components/add-merchandise/add-merchandise.component';
import { AddStockComponent } from './products/components/add-stock/add-stock.component';
import { ProductEditorComponent } from './products/components/product-editor/product-editor.component';
import { TransferStocksBetweenLocationsComponent } from './products/components/transfer-stocks-between-locations/transfer-stocks-between-locations.component';
import { UpdateMerchandiseRegisterComponent } from './products/components/update-merchandise-register/update-merchandise-register.component';
import { ViewMerchandiseRegistersComponent } from './products/components/view-merchandise-registers/view-merchandise-registers.component';
import { ViewProductsComponent } from './products/components/view-products/view-products.component';
import { ProviderBillEditorComponent } from './providers/components/provider-bill-editor/provider-bill-editor.component';
import { ProviderEditorComponent } from './providers/components/provider-editor/provider-editor.component';
import { ViewProviderBillsComponent } from './providers/components/view-provider-bills/view-provider-bills.component';
import { ViewProvidersComponent } from './providers/components/view-providers/view-providers.component';
import { DetailedSalesReportComponent } from './reports/components/detailed-sales-report/detailed-sales-report.component';
import { ProductReportComponent } from './reports/components/product-report/product-report.component';
import { SalesReportComponent } from './reports/components/sales-report/sales-report.component';
import { AddSaleComponent } from './sales/components/add-sale/add-sale.component';
import { UpdateSaleComponent } from './sales/components/update-sale/update-sale.component';
import { ViewSalesComponent } from './sales/components/view-sales/view-sales.component';
import { SellerEditorComponent } from './sellers/components/seller-editor/seller-editor.component';
import { ViewSellersComponent } from './sellers/components/view-sellers/view-sellers.component';
import { UserEditorComponent } from './users/components/user-editor/user-editor.component';
import { ViewUsersComponent } from './users/components/view-users/view-users.component';

const routes: Routes = [{
  path: "",
  component: ManagementAppComponent,
  children: [
    {
      path: "",
      component: HomeComponent,
      canActivate: [AuthGuardService]
    },
    {
      path: "home",
      component: HomeComponent,
      canActivate: [AuthGuardService]
    },
    {
      path: 'products/view-products',
      component: ViewProductsComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'products/add-product',
      component: ProductEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'products/edit-product/:id',
      component: ProductEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'products/add-stock',
      component: AddStockComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'products/add-merchandise',
      component: AddMerchandiseComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'products/update-merchandise-register/:id',
      component: UpdateMerchandiseRegisterComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'products/view-merchandise-registers',
      component: ViewMerchandiseRegistersComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'products/transfer-stock-between-locations',
      component: TransferStocksBetweenLocationsComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'Admin'
      }
    },
    {
      path: 'business-services/view-services',
      component: ViewBusinessServicesComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      },
    },
    {
      path: 'business-services/edit-service/:id',
      component: BusinessServiceEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      },
    },
    {
      path: 'business-services/add-service',
      component: BusinessServiceEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'sales/add-sale',
      component: AddSaleComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'sales/update-sale/:id',
      component: UpdateSaleComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'sales/view-sales',
      component: ViewSalesComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'billing/add-bill/:id',
      component: AddBillComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'sales/pre-order',
      component: PreOrderComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'orders/add-order',
      component: AddOrderComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'orders/update-order/:id',
      component: UpdateOrderComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'orders/view-order',
      component: ViewOrdersComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'credits/add-credit',
      component: CreditEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'credits/view-credits',
      component: ViewCreditsComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'clients/view-clients',
      component: ViewClientsComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'clients/add-client',
      component: ClientEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'clients/edit-client/:id',
      component: ClientEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'sellers/view-sellers',
      component: ViewSellersComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'sellers/add-seller',
      component: SellerEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'sellers/edit-seller/:id',
      component: SellerEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'providers/add-provider',
      component: ProviderEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'providers/edit-provider/:id',
      component: ProviderEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'providers/view-providers',
      component: ViewProvidersComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'providers/add-provider-bill',
      component: ProviderBillEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Billing'
      }
    },
    {
      path: 'providers/edit-provider-bill/:id',
      component: ProviderBillEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Billing'
      }
    },
    {
      path: 'providers/view-providers-bill',
      component: ViewProviderBillsComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Billing'
      }
    },
    {
      path: 'cash-registers/add-cash-register',
      component: CashRegisterEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'cash-registers/edit-cash-register/:id',
      component: CashRegisterEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'cash-registers/cash-registers-dashboard',
      component: CashRegisterDashboardComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'expenses/add-expense',
      component: AddExpenseComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'expenses/view-expenses',
      component: ViewExpensesComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'accounting/shopping-book',
      component: ShoppingBookComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Billing'
      }
    },
    {
      path: 'accounting/sales-book',
      component: SalesBookComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Billing'
      }
    },
    {
      path: "reports/sales-report",
      component: SalesReportComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: "reports/product-report",
      component: ProductReportComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: "reports/detailed-sales-report",
      component: DetailedSalesReportComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin'
      }
    },
    {
      path: 'admin/add-category',
      component: CategoryEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'admin/edit-category/:id',
      component: CategoryEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'admin/view-categories',
      component: ViewCategoriesComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'admin/add-sub-category',
      component: SubCategoryEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'admin/edit-sub-category/:id',
      component: SubCategoryEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'admin/view-sub-categories',
      component: ViewSubCategoriesComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'admin/add-location',
      component: LocationEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'admin/view-locations',
      component: ViewLocationsComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'admin/edit-location/:id',
      component: LocationEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: 'admin/sale-configuration',
      component: SaleConfigurationComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Admin,Basic'
      }
    },
    {
      path: "admin/billing/billing-information-editor",
      component: BillingInformationEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Billing'
      }
    },
    {
      path: "admin/billing/billing-information-editor/:id",
      component: BillingInformationEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Billing'
      }
    },
    {
      path: "admin/billing/view-bill-configurations",
      component: ViewBillConfigurationsComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin,Billing'
      }
    },
    {
      path: "users/add-user",
      component: UserEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin'
      }
    },
    {
      path: 'users/edit-user/:id',
      component: UserEditorComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin'
      }
    },
    {
      path: "users/view-users",
      component: ViewUsersComponent,
      canActivate: [AuthGuardService],
      data: {
        roles: 'SuperAdmin'
      }
    },
    {
      path: 'change-password/:id',
      component: ChangePasswordComponent,
      canActivate: [AuthGuardService]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementAppRoutingModule { }
