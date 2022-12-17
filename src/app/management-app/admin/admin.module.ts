import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleConfigurationComponent } from './components/sale-configuration/sale-configuration.component';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { LocationsModule } from './locations/locations.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SaleConfigurationDatastoreService } from './services/sale-configuration-datastore.service';
import { SaleConfigurationService } from './services/sale-configuration.service';

@NgModule({
  declarations: [SaleConfigurationComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    CategoriesModule,
    SubCategoriesModule,
    LocationsModule,
    NgbModule
  ],
  providers: [
    SaleConfigurationDatastoreService,
    SaleConfigurationService,
  ]
})
export class AdminModule { }
