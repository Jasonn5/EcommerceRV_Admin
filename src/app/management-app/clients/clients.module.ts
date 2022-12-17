import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientEditorComponent } from './components/client-editor/client-editor.component';
import { SearchClientComponent } from './components/search-client/search-client.component';
import { ViewClientsComponent } from './components/view-clients/view-clients.component';
import { ClientDatastoreService } from './services/client-datastore.service';
import { ClientService } from './services/client.service';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgGridModule } from 'ag-grid-angular';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [ClientEditorComponent, SearchClientComponent, ViewClientsComponent],
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
  exports: [
    SearchClientComponent
  ],
  providers: [
    ClientDatastoreService,
    ClientService
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent
  ]
})
export class ClientsModule { }
