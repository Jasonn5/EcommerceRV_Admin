import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationEditorComponent } from './components/location-editor/location-editor.component';
import { ViewLocationsComponent } from './components/view-locations/view-locations.component';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LocationDatastoreService } from './services/location-datastore.service';
import { LocationService } from './services/location.service';
import { IconRendererComponent } from '../../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [LocationEditorComponent, ViewLocationsComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSpinnerModule,
    AgGridModule.withComponents([]),
    FormsModule,
    ReactiveFormsModule,    
    AppRoutingModule
  ],
  providers: [
    LocationDatastoreService,
    LocationService
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent,
  ]
})
export class LocationsModule { }
