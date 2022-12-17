import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationMeasureTypePipe } from './pipes/duration-measure-type.pipe';
import { BusinessServiceEditorComponent } from './components/business-service-editor/business-service-editor.component';
import { ViewBusinessServicesComponent } from './components/view-business-services/view-business-services.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BusinessServiceDatastoreService } from './services/business-service-datastore.service';
import { BusinessServiceService } from './services/business-service.service';
import { IconRendererComponent } from '../components/icon-renderer/icon-renderer.component';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [DurationMeasureTypePipe, BusinessServiceEditorComponent, ViewBusinessServicesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NbCardModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSpinnerModule,
    AgGridModule.withComponents([]),
    AppRoutingModule
  ],
  providers: [
    BusinessServiceDatastoreService,
    BusinessServiceService,
    DurationMeasureTypePipe
  ],
  entryComponents: [
    IconRendererComponent,
    ConfirmationModalComponent
  ]
})
export class BusinessServicesModule { }
