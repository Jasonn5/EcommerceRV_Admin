import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesBookComponent } from './components/sales-book/sales-book.component';
import { ShoppingBookComponent } from './components/shopping-book/shopping-book.component';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AccountingService } from './services/accounting.service';

@NgModule({
  declarations: [SalesBookComponent, ShoppingBookComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbSpinnerModule,
    NbIconModule,
    NgbModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    AccountingService
  ]
})
export class AccountingModule { }
