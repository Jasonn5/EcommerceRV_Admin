import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { CashRegisterDashboardComponent } from './components/cash-register-dashboard/cash-register-dashboard.component';
import { CashRegisterEditorComponent } from './components/cash-register-editor/cash-register-editor.component';
import { ViewCashRegisterEntriesComponent } from './components/view-cash-register-entries/view-cash-register-entries.component';
import { CashRegisterDatastoreService } from './services/cash-register-datastore.service';
import { CashRegisterService } from './services/cash-register.service';
import { CashRegisterEntryDatastoreService } from './services/cash-register-entry-datastore.service';
import { CashRegisterEntryService } from './services/cash-register-entry.service';
import { NbCardModule, NbIconModule, NbListModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TypePipe } from './pipes/cash-register-type';

@NgModule({
  declarations: [AddEntryComponent, CashRegisterDashboardComponent, CashRegisterEditorComponent, TypePipe, ViewCashRegisterEntriesComponent],
  imports: [
    CommonModule,
    NbListModule,
    NbCardModule,
    NbSpinnerModule,
    NbEvaIconsModule,
    NbIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AgGridModule.withComponents([]),
    AppRoutingModule
  ],
  providers: [
    CashRegisterDatastoreService,
    CashRegisterService,
    CashRegisterEntryDatastoreService,
    CashRegisterEntryService,
    TypePipe
  ],
  entryComponents: [
    AddEntryComponent,
    ViewCashRegisterEntriesComponent,
    IconRendererComponent
  ]
})
export class CashRegistersModule { }
